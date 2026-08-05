import React, { useState } from "react";
import { ManuscriptDocument } from "../types";
import { Download, FileText, Code, Check, Printer, X } from "lucide-react";

interface ExportModalProps {
  document: ManuscriptDocument;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ document, onClose }) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const getMarkdownContent = () => {
    return `# ESTUDIO PALEOGRÁFICO Y NORMALIZACIÓN HISTÓRICA

## Ficha Archivística
- **Título**: ${document.archivalMetadata.title}
- **Archivo**: ${document.archivalMetadata.archive}
- **Fondo / Sección**: ${document.archivalMetadata.section}
- **Signatura**: ${document.archivalMetadata.signature}
- **Fecha**: ${document.archivalMetadata.date}
- **Escritura**: ${document.archivalMetadata.scriptType}

---

## 1. Transcripción Paleográfica Literal
*(Respetando saltos de línea originales, grafías de época y abreviaturas desplegadas entre [ ])*

\`\`\`
${document.literalTranscription}
\`\`\`

---

## 2. Versión Normalizada (Español Moderno)
*(Texto adaptado a la norma ortográfica, sintáctica y de acentuación actual)*

${document.normalizedVersion}

---

## Abreviaturas Registradas
${document.abbreviationsList
  .map((a) => `- **${a.abbreviation}** → **${a.expansion}**: ${a.meaning}`)
  .join("\n")}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownContent());
    setCopiedFormat("markdown");
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${document.archivalMetadata.signature} - Informe Paleográfico</title>
          <style>
            body { font-family: Georgia, serif; line-height: 1.6; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 22px; border-bottom: 2px solid #8b0000; padding-bottom: 8px; margin-bottom: 16px; }
            h2 { font-size: 16px; color: #8b0000; margin-top: 24px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
            .meta { background: #f9f8f6; border: 1px solid #e0ddd5; padding: 16px; border-radius: 6px; font-size: 13px; margin-bottom: 20px; }
            .literal { font-family: monospace; white-space: pre-wrap; background: #faf9f6; padding: 16px; border-left: 3px solid #8b0000; font-size: 13px; }
            .normalized { white-space: pre-wrap; font-size: 14px; line-height: 1.8; }
            .abbr-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
            .abbr-table th, .abbr-table td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
            .abbr-table th { background: #f2efe9; }
          </style>
        </head>
        <body>
          <h1>Estudio Paleográfico y Normalización Histórica</h1>
          <div class="meta">
            <strong>Archivo:</strong> ${document.archivalMetadata.archive}<br/>
            <strong>Signatura:</strong> ${document.archivalMetadata.signature}<br/>
            <strong>Fecha:</strong> ${document.archivalMetadata.date}<br/>
            <strong>Escritura:</strong> ${document.archivalMetadata.scriptType}
          </div>

          <h2>1. Transcripción Paleográfica Literal</h2>
          <div class="literal">${document.literalTranscription}</div>

          <h2>2. Versión Normalizada (Español Moderno)</h2>
          <div class="normalized">${document.normalizedVersion}</div>

          <h2>Relación de Abreviaturas</h2>
          <table class="abbr-table">
            <thead>
              <tr><th>Abreviatura</th><th>Expansión</th><th>Significado</th></tr>
            </thead>
            <tbody>
              ${document.abbreviationsList
                .map(
                  (a) =>
                    `<tr><td><strong>${a.abbreviation}</strong></td><td>${a.expansion}</td><td>${a.meaning}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-amber-900/50 rounded-xl max-w-xl w-full p-6 shadow-2xl text-stone-200 font-serif space-y-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-amber-900/40 pb-3">
          <Download className="w-6 h-6 text-amber-400" />
          <h3 className="text-lg font-bold text-amber-100">
            Exportar transcripción del documento
          </h3>
        </div>

        <p className="text-xs text-amber-300/80">
          Selecciona el formato deseado para descargar o copiar el estudio paleográfico de{" "}
          <strong className="text-amber-100">{document.archivalMetadata.signature}</strong>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Markdown Download */}
          <button
            onClick={() =>
              handleDownloadFile(
                `${document.id}-transcripcion.md`,
                getMarkdownContent(),
                "text/markdown"
              )
            }
            className="flex items-center gap-3 bg-stone-950 hover:bg-stone-800 border border-amber-900/40 p-3 rounded-lg text-left transition-colors cursor-pointer"
          >
            <Code className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-200 block">Archivo Markdown (.md)</span>
              <span className="text-[11px] text-stone-400">Ideal para GitHub, Obsidian u OJS</span>
            </div>
          </button>

          {/* Plain text Download */}
          <button
            onClick={() =>
              handleDownloadFile(
                `${document.id}-transcripcion.txt`,
                `TRANSCRIPCIÓN LITERAL:\n${document.literalTranscription}\n\nVERSIÓN NORMALIZADA:\n${document.normalizedVersion}`,
                "text/plain"
              )
            }
            className="flex items-center gap-3 bg-stone-950 hover:bg-stone-800 border border-amber-900/40 p-3 rounded-lg text-left transition-colors cursor-pointer"
          >
            <FileText className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-200 block">Texto Plano (.txt)</span>
              <span className="text-[11px] text-stone-400">Formato simple universal</span>
            </div>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-3 bg-stone-950 hover:bg-stone-800 border border-amber-900/40 p-3 rounded-lg text-left transition-colors cursor-pointer"
          >
            {copiedFormat === "markdown" ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Code className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold text-amber-200 block">
                {copiedFormat === "markdown" ? "¡Copiado al portapapeles!" : "Copiar Markdown"}
              </span>
              <span className="text-[11px] text-stone-400">Pegar directo en procesadores</span>
            </div>
          </button>

          {/* Printable Report */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-3 bg-stone-950 hover:bg-stone-800 border border-amber-900/40 p-3 rounded-lg text-left transition-colors cursor-pointer"
          >
            <Printer className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-200 block">Imprimir / PDF</span>
              <span className="text-[11px] text-stone-400">Generar informe listo para imprenta</span>
            </div>
          </button>

        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 text-xs px-4 py-2 rounded transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
