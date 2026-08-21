import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Maximum size of an uploaded manuscript scan, measured on the decoded bytes
// (i.e. the original file), not on its base64 representation.
// Keep this value in sync with ALLOWED_IMAGE_MAX_BYTES in
// src/components/AiAnalysisModal.tsx, which enforces the same limit up front.
const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB

// base64 inflates a payload by ~33%; the extra margin covers the JSON envelope
// and the custom prompt. Requests above this never reach the route handler.
const MAX_REQUEST_BODY = "30mb";

app.use(express.json({ limit: MAX_REQUEST_BODY }));
app.use(express.urlencoded({ extended: true, limit: MAX_REQUEST_BODY }));

// express.json() rejects oversized bodies with an HTML error page by default.
// Turn that into the same JSON shape (and wording) the route itself returns.
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      error: `La imagen es demasiado grande. El tamaño máximo admitido es de ${formatMegabytes(
        MAX_IMAGE_BYTES
      )}. Reduce la resolución o vuelve a guardar el escaneo con mayor compresión.`,
    });
  }
  return next(err);
});

const isProduction = process.env.NODE_ENV === "production";

// Initialize Gemini Client. The API key is read here only, server-side; it is
// never sent to the browser nor exposed through a VITE_* variable.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Only these MIME types are accepted for uploaded manuscript scans.
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function formatMegabytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

// Size of the decoded image, derived from the base64 string without allocating
// a Buffer for it: every 4 base64 chars carry 3 bytes, minus the "=" padding.
function decodedByteLength(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

// Leading "data:<mime>;base64," of a data URL, capturing the declared MIME type.
const DATA_URL_PREFIX = /^data:([\w.+-]+\/[\w.+-]+);base64,/;

// Standard base64: the alphabet plus at most two "=" of padding, and a length
// that is a multiple of 4. FileReader.readAsDataURL() emits exactly this, with
// no line breaks, so anything else is a malformed payload.
const BASE64_PAYLOAD = /^[A-Za-z0-9+/]+={0,2}$/;

function isValidBase64(payload: string): boolean {
  return payload.length % 4 === 0 && BASE64_PAYLOAD.test(payload);
}

// Thin, credential-free surface for calling Gemini. Exported for tests to
// mock — unlike `ai`, this object holds no apiKey or client internals.
const geminiClient = {
  generateContent: (args: Parameters<typeof ai.models.generateContent>[0]) =>
    ai.models.generateContent(args),
};

// Paleography analysis API endpoint
app.post("/api/paleography/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType, customPrompt } = req.body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({
        error: "Debes subir una imagen del manuscrito antes de ejecutar el análisis.",
      });
    }

    if (!mimeType || !ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
      return res.status(400).json({
        error: "Formato de imagen no soportado. Usa JPEG, PNG o WebP.",
      });
    }

    const dataUrlPrefix = DATA_URL_PREFIX.exec(imageBase64);
    const cleanBase64 = dataUrlPrefix
      ? imageBase64.slice(dataUrlPrefix[0].length)
      : imageBase64;

    // A data URL carries its own MIME type. If it disagrees with the declared
    // `mimeType`, one of the two is wrong and Gemini would be told to decode the
    // bytes as something they are not.
    if (dataUrlPrefix && dataUrlPrefix[1].toLowerCase() !== mimeType.toLowerCase()) {
      return res.status(400).json({
        error: "El tipo de imagen declarado no coincide con el contenido enviado. Vuelve a subir el escaneo.",
      });
    }

    if (cleanBase64.length === 0) {
      return res.status(400).json({
        error: "La imagen recibida está vacía. Vuelve a subir el escaneo del manuscrito.",
      });
    }

    // Checked before the base64 syntax so an oversized payload is rejected
    // without scanning tens of megabytes of text first.
    if (decodedByteLength(cleanBase64) > MAX_IMAGE_BYTES) {
      return res.status(413).json({
        error: `La imagen es demasiado grande. El tamaño máximo admitido es de ${formatMegabytes(
          MAX_IMAGE_BYTES
        )}. Reduce la resolución o vuelve a guardar el escaneo con mayor compresión.`,
      });
    }

    if (!isValidBase64(cleanBase64)) {
      return res.status(400).json({
        error: "El contenido de la imagen no es un Base64 válido. Vuelve a subir el escaneo del manuscrito.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY environment variable is not configured.");
      return res.status(500).json({
        error: isProduction
          ? "El servicio de análisis no está disponible en este momento."
          : "GEMINI_API_KEY environment variable is not configured.",
      });
    }

    const systemInstruction = `Eres un paleógrafo catedrático y archivero experto en documentación histórica hispánica de los siglos XV al XVIII, especialista en los fondos del Archivo General de Indias (AGI), Archivo General de Simancas (AGS) y Archivo Histórico Nacional (AHN).

Tu objetivo es analizar minuciosamente imágenes de manuscritos o pasajes históricos de la época moderna hispana (escrituras cortesana, procesal, encadenada o procesal encadenada, e itálica/humanística) y proporcionar una respuesta estructurada con rigor académico.

Estructura obligatoria de la respuesta JSON:
Deberás devolver un objeto JSON válido con los siguientes campos:

1. "literalTranscription": Cadena de texto con la transcripción paleográfica literal.
   - Respeta estrictamente los saltos de línea originales del manuscrito (usa \\n para cada línea).
   - Mantén la ortografía, mayúsculas, minúsculas, falta de acentuación y grafías de la época (p. ej. "ç", "v"/"u", "i"/"j", "x", "ff", "ss").
   - Despliega TODAS las abreviaturas escribiendo las letras omitidas o supuestas entre corchetes rectos [ ]. Ejemplo: "dho" -> "d[ic]ho", "q̄" -> "q[ue]", "nros" -> "n[uest]ros", "M[ajes]tad", "R[ea]l", "ciu[da]d", "S.M." -> "S[u] M[ajes]tad".
   - Utiliza [ilegible] para pasajes destruidos o desgastados, y [dudoso: lectura] para lecturas probables pero no seguras.

2. "normalizedVersion": Cadena de texto con la versión normalizada en español moderno.
   - Ajusta la ortografía a la norma RAE actual.
   - Restablece la puntuación, acentuación y párrafos para permitir una lectura fluida e interpretación histórica inmediata.
   - Mantiene la fidelidad al significado exacto del documento original.

3. "archivalMetadata": Objeto con datos paleográficos y contextuales:
   - "estimatedPeriod": Ej. "Finales del siglo XVI (ca. 1597)"
   - "scriptType": Ej. "Escritura Procesal Encadenada / Humanística de Cancillería"
   - "probableArchive": Ej. "Archivo General de Indias (Sevilla) / Sección Patronato o Indiferente General"
   - "historicalContext": Breve resumen sintético (2-3 frases) del asunto histórico, instituciones o personajes mencionados.

4. "abbreviationsList": Un array de objetos { "abbreviation": string, "expansion": string, "meaning": string } listando las principales abreviaturas paleográficas halladas en el documento.

5. "lineByLine": Un array de objetos con cada línea transcrita { "lineNumber": number, "literal": string, "normalized": string, "notes": string } para facilitar la cotejación visual línea a línea.`;

    const contentsPayload: any = {
      parts: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        {
          text: customPrompt || "Realiza el estudio paleográfico literal y la versión normalizada en español moderno de este manuscrito histórico de los siglos XV-XVIII.",
        },
      ],
    };

    const response = await geminiClient.generateContent({
      model: "gemini-3.6-flash",
      contents: contentsPayload,
      // gemini-3.6-flash no longer accepts sampling parameters (temperature,
      // top_p, top_k), so none are sent here.
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      parsedData = { rawText: responseText };
    }

    return res.json(parsedData);
  } catch (err: any) {
    // Full details stay in the server log. The browser only gets a generic
    // message in production, so upstream errors never leak provider internals.
    console.error("Error in paleography analysis API:", err);
    return res.status(500).json({
      error: isProduction
        ? "No se ha podido completar el análisis paleográfico. Inténtalo de nuevo más tarde."
        : err?.message || "Internal server error during paleography analysis.",
    });
  }
});

async function startServer() {
  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de Paleografía Activo en http://0.0.0.0:${PORT}`);
  });
}

// Skip auto-start when imported by the test suite, so tests can exercise
// `app` on an ephemeral port without booting Vite middleware / binding PORT.
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, geminiClient, MAX_IMAGE_BYTES };
