import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for high-res manuscript scans
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Only these MIME types are accepted for uploaded manuscript scans.
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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

    if (!imageBase64) {
      return res.status(400).json({
        error: "Debes subir una imagen del manuscrito antes de ejecutar el análisis.",
      });
    }

    if (!mimeType || !ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
      return res.status(400).json({
        error: "Formato de imagen no soportado. Usa JPEG, PNG o WebP.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured.",
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

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
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
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
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
    console.error("Error in paleography analysis API:", err);
    return res.status(500).json({ error: err.message || "Internal server error during paleography analysis." });
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
// `app` on an ephemeral port without booting Vite middleware / port 3000.
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, geminiClient };
