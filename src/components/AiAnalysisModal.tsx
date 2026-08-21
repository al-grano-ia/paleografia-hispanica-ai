import React, { useState } from "react";
import { ManuscriptDocument } from "../types";
import { Sparkles, Loader2, Upload, FileCheck, HelpCircle, ArrowRight, RefreshCw } from "lucide-react";

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Same ceiling the server enforces (MAX_IMAGE_BYTES in server.ts). Checking it
// here too avoids uploading tens of megabytes only to be rejected afterwards.
const ALLOWED_IMAGE_MAX_BYTES = 20 * 1024 * 1024; // 20 MB

export const MAX_SIZE_LABEL = `${Math.round(ALLOWED_IMAGE_MAX_BYTES / (1024 * 1024))} MB`;

const formatMegabytes = (bytes: number) =>
  `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;

// Everything Gemini infers about a document — archive, period, script type,
// historical context — is a guess about an unidentified scan. It is labelled as
// such so it is never read as an archival fact, and when the model says nothing
// the field stays explicitly undetermined instead of being filled with a
// plausible-looking default.
const asEstimate = (value?: string) => (value ? `${value} (estimación de IA)` : undefined);

interface AiAnalysisModalProps {
  onAnalysisComplete: (newDoc: ManuscriptDocument) => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({ onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(
    "Realiza el estudio paleográfico literal con abreviaturas entre corchetes [ ] y la versión normalizada en español moderno de este manuscrito."
  );
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      setErrorMessage("Formato no soportado. Sube una imagen JPEG, PNG o WebP.");
      setUploadedImageBase64(null);
      setUploadedMimeType(null);
      return;
    }

    if (file.size > ALLOWED_IMAGE_MAX_BYTES) {
      setErrorMessage(
        `La imagen pesa ${formatMegabytes(file.size)} y supera el máximo de ${MAX_SIZE_LABEL}. ` +
          "Reduce la resolución o vuelve a guardar el escaneo con mayor compresión."
      );
      setUploadedImageBase64(null);
      setUploadedMimeType(null);
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImageBase64(reader.result as string);
      setUploadedMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async () => {
    if (!uploadedImageBase64 || !uploadedMimeType) {
      setErrorMessage("Debes subir una imagen del manuscrito (JPEG, PNG o WebP) antes de ejecutar el análisis.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/paleography/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: uploadedImageBase64,
          mimeType: uploadedMimeType,
          customPrompt,
        }),
      });

      if (!response.ok) {
        // Surface the server's own message (e.g. the size limit) when it sends
        // one; fall back to the status code if the body is not JSON.
        const serverError = await response
          .json()
          .then((body) => body?.error)
          .catch(() => null);
        throw new Error(serverError || `Error en servidor de análisis (${response.status})`);
      }

      const data = await response.json();
      setAnalysisResult(data);

      if (data.literalTranscription) {
        // Construct new document object
        const estimated = data.archivalMetadata;
        const newDoc: ManuscriptDocument = {
          id: "uploaded-" + Date.now(),
          title: estimated?.title || "Manuscrito sin identificar",
          imageUrl: uploadedImageBase64,
          archivalMetadata: {
            title: estimated?.title || "Manuscrito sin identificar",
            archive: asEstimate(estimated?.probableArchive) ?? "Archivo no determinado",
            section: "Transcripción generada por IA · sin cotejo archivístico",
            signature: "Sin signatura verificada",
            date: asEstimate(estimated?.estimatedPeriod) ?? "Periodo no determinado",
            scriptType: asEstimate(estimated?.scriptType) ?? "Tipología no determinada",
            reign: "No determinado",
            summary: estimated?.historicalContext
              ? `Estimación de IA: ${estimated.historicalContext}`
              : "Sin contexto histórico determinado.",
          },
          literalTranscription: data.literalTranscription,
          normalizedVersion: data.normalizedVersion || "",
          lineByLine: data.lineByLine || [],
          abbreviationsList: data.abbreviationsList || [],
        };

        onAnalysisComplete(newDoc);
      }
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      setErrorMessage(err.message || "Error al procesar el manuscrito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-900 border border-amber-900/40 rounded-xl p-6 shadow-2xl text-stone-200 font-serif space-y-6">
      
      {/* Title */}
      <div className="flex items-center space-x-3 border-b border-amber-900/40 pb-4">
        <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-3 rounded-lg border border-amber-600/40 shadow-inner">
          <Sparkles className="w-6 h-6 text-amber-200" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-100">
            Asistente Paleógrafo Inteligente (Gemini 3.6 Flash)
          </h2>
          <p className="text-xs text-amber-300/70 font-sans">
            Analiza manuscritos del Archivo General de Indias y Simancas. Transcribe línea a línea, despliega abreviaturas y genera la versión normalizada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Input Options */}
        <div className="space-y-4 bg-stone-950/80 p-5 rounded-lg border border-amber-900/30">
          <h3 className="text-sm font-bold text-amber-200 flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>1. Seleccionar Manuscrito a Analizar</span>
          </h3>

          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-amber-800/50 hover:border-amber-600 rounded-lg p-6 text-center bg-stone-900/50 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload-ai"
            />
            <label htmlFor="file-upload-ai" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-amber-200 font-medium">
                Haz clic para subir un escaneo manuscrito (JPG, PNG, WebP · máx. {MAX_SIZE_LABEL})
              </p>
              <p className="text-[11px] text-stone-400">
                Es obligatorio subir una imagen: el análisis no puede ejecutarse sin ella.
              </p>
            </label>
          </div>

          {uploadedImageBase64 && (
            <div className="flex items-center gap-3 bg-amber-950/40 p-2.5 rounded border border-amber-700/50">
              <img
                src={uploadedImageBase64}
                alt="Preview"
                className="w-12 h-12 object-cover rounded border border-amber-600"
              />
              <span className="text-xs text-amber-200 font-mono">
                Imagen subida correctamente lista para examen paleográfico
              </span>
            </div>
          )}

          {/* Prompt Instructions */}
          <div className="space-y-2 pt-2">
            <label className="text-xs text-amber-300 font-mono">
              Instrucciones Específicas para el Asistente:
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              className="w-full bg-stone-900 text-amber-100 border border-amber-800/60 rounded p-3 text-xs font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={loading || !uploadedImageBase64}
            title={!uploadedImageBase64 ? "Sube una imagen del manuscrito para habilitar el análisis" : undefined}
            className="w-full bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 font-medium py-3 rounded-lg shadow-lg border border-amber-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                <span className="text-xs font-mono">Analizando grafías, ligaduras y abreviaturas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs">Ejecutar Análisis Paleográfico Completo</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="bg-rose-950/80 border border-rose-700 text-rose-200 p-3 rounded text-xs font-mono">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Output Preview */}
        <div className="space-y-4 bg-stone-950/80 p-5 rounded-lg border border-amber-900/30 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-amber-200 flex items-center gap-2 border-b border-amber-900/30 pb-2">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>2. Resultado del Examen Paleográfico</span>
          </h3>

          {analysisResult ? (
            <div className="space-y-4 text-xs font-serif overflow-auto max-h-[380px] pr-2">
              <div className="bg-stone-900 p-3 rounded border border-amber-800/40 space-y-1">
                <span className="text-amber-400 font-mono font-bold text-[10px] uppercase">
                  Tipología estimada por la IA:
                </span>
                <p className="text-amber-100 font-medium">
                  {analysisResult.archivalMetadata?.scriptType || "No determinada"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-amber-300 font-mono font-bold text-[10px] uppercase">
                  Muestra de Transcripción Literal (Líneas iniciales):
                </span>
                <div className="bg-stone-900 p-3 rounded font-mono text-[11px] text-amber-100/90 whitespace-pre-wrap leading-relaxed border border-amber-900/30">
                  {analysisResult.literalTranscription?.slice(0, 300)}...
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-amber-300 font-mono font-bold text-[10px] uppercase">
                  Muestra de Versión Normalizada:
                </span>
                <div className="bg-stone-900 p-3 rounded font-serif text-xs text-stone-200 whitespace-pre-wrap leading-relaxed border border-amber-900/30">
                  {analysisResult.normalizedVersion?.slice(0, 300)}...
                </div>
              </div>

              <p className="text-emerald-400 font-mono text-[11px] text-center pt-2">
                ✓ Transcripción cargada en el área de trabajo principal.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400 space-y-2 my-auto">
              <HelpCircle className="w-10 h-10 text-amber-500/40 mx-auto" />
              <p className="text-xs font-serif">
                Haz clic en "Ejecutar Análisis" para solicitar la lectura del manuscrito.
              </p>
              <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                El modelo procesará los trazos, signos de abreviación, renglones y ortografía del siglo XVI-XVIII.
              </p>
            </div>
          )}

          <div className="bg-amber-950/40 p-3 rounded border border-amber-900/40 text-[11px] text-amber-300/80 font-mono">
            Powered by Gemini 3.6 Flash Server-Side API • Archivo General de Indias & Simancas
          </div>
        </div>

      </div>
    </div>
  );
};
