import React, { useState } from "react";
import { ManuscriptDocument, LineItem } from "../types";
import {
  FileText,
  BookOpen,
  ListOrdered,
  Copy,
  Check,
  Edit3,
  HelpCircle,
  AlertTriangle,
  Info,
  Bookmark,
  Sparkles,
} from "lucide-react";

interface TranscriptionPanelProps {
  document: ManuscriptDocument;
  selectedLineNumber: number | null;
  onSelectLine: (lineNum: number) => void;
  onUpdateTranscription: (newLiteral: string, newNormalized: string, newLines: LineItem[]) => void;
}

// Shared by the four inner tabs. Same responsive treatment as the header's
// navTabClasses (Header.tsx): tighter padding and smaller text below `sm`, and
// the same explicit focus ring, since the default is barely visible on this
// dark palette.
const panelTabClasses = (isActive: boolean) =>
  [
    "flex items-center justify-center sm:justify-start gap-1.5",
    // nowrap only on phones, where the short labels always fit on one line;
    // from `sm` the full labels must stay free to wrap inside the button (as
    // they did originally), or the row overflows the card between 640 and
    // ~830px — this card clips with overflow-hidden instead of scrolling.
    "px-2 py-2 sm:px-3 sm:py-1.5 text-xs font-serif whitespace-nowrap sm:whitespace-normal",
    "rounded-md transition-colors cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
    isActive
      ? "bg-amber-800 text-amber-100 font-semibold border border-amber-600/50 shadow-sm"
      : "text-amber-300/80 hover:bg-stone-700 hover:text-amber-100",
  ].join(" ");

export const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  document,
  selectedLineNumber,
  onSelectLine,
  onUpdateTranscription,
}) => {
  const [activeTab, setActiveTab] = useState<"literal" | "normalized" | "linebyline" | "metadata">("literal");
  const [copiedLiteral, setCopiedLiteral] = useState(false);
  const [copiedNormalized, setCopiedNormalized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editableLiteral, setEditableLiteral] = useState(document.literalTranscription);
  const [editableNormalized, setEditableNormalized] = useState(document.normalizedVersion);

  const handleCopyLiteral = () => {
    navigator.clipboard.writeText(editableLiteral);
    setCopiedLiteral(true);
    setTimeout(() => setCopiedLiteral(false), 2000);
  };

  const handleCopyNormalized = () => {
    navigator.clipboard.writeText(editableNormalized);
    setCopiedNormalized(true);
    setTimeout(() => setCopiedNormalized(false), 2000);
  };

  const handleSaveEdits = () => {
    // Reconstruct lines array
    const rawLines = editableLiteral.split("\n");
    const normLines = editableNormalized.split("\n");

    const newLines: LineItem[] = rawLines.map((line, idx) => ({
      lineNumber: idx + 1,
      literal: line,
      normalized: normLines[idx] || line,
      notes: "Editado por el usuario",
    }));

    onUpdateTranscription(editableLiteral, editableNormalized, newLines);
    setIsEditing(false);
  };

  const insertTag = (tag: string) => {
    setEditableLiteral((prev) => prev + " " + tag);
  };

  // Helper to render text with highlighted bracketed abbreviations [expansions]
  const renderHighlightedLiteral = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        if (part.includes("dudoso:")) {
          return (
            <span
              key={i}
              className="bg-amber-500/20 text-amber-200 border border-amber-500/40 px-1 py-0.5 rounded font-mono font-semibold"
              title="Lectura dudosa"
            >
              {part}
            </span>
          );
        }
        if (part.includes("ilegible")) {
          return (
            <span
              key={i}
              className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1 py-0.5 rounded font-mono italic font-semibold"
              title="Texto destruido o desgaste de tinta"
            >
              {part}
            </span>
          );
        }
        return (
          <span
            key={i}
            className="bg-amber-900/40 text-amber-300 font-mono font-semibold border-b border-amber-500/50"
            title="Abreviatura paleográfica desplegada"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="bg-stone-900 border border-amber-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[550px]">
      
      {/* Header Tabs.
          Below `sm` the four tabs sit in a 2x2 grid with short labels — in one
          non-wrapping row they needed ~469px and were clipped by this card's
          overflow-hidden. The action controls (Editar/Guardar, Copiar) drop to
          their own row underneath. From `sm` up both the tab row and the
          controls return to their original inline layout. */}
      <div className="bg-stone-800/90 px-4 py-2 border-b border-amber-900/30 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
        <div className="grid grid-cols-2 gap-1 sm:flex sm:items-center sm:space-x-1">
          <button onClick={() => setActiveTab("literal")} className={panelTabClasses(activeTab === "literal")}>
            <FileText className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="sm:hidden">Literal</span>
            <span className="hidden sm:inline">1. Transcripción Literal</span>
          </button>

          <button onClick={() => setActiveTab("normalized")} className={panelTabClasses(activeTab === "normalized")}>
            <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="sm:hidden">Normalizada</span>
            <span className="hidden sm:inline">2. Versión Normalizada</span>
          </button>

          <button onClick={() => setActiveTab("linebyline")} className={panelTabClasses(activeTab === "linebyline")}>
            <ListOrdered className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="sm:hidden">Cotejo</span>
            <span className="hidden sm:inline">Cotejo Línea por Línea</span>
          </button>

          <button onClick={() => setActiveTab("metadata")} className={panelTabClasses(activeTab === "metadata")}>
            <Info className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="sm:hidden">Ficha</span>
            <span className="hidden sm:inline">Ficha Archivística</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {isEditing ? (
            <button
              onClick={handleSaveEdits}
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded font-medium shadow transition-colors cursor-pointer"
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/40 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
              title="Editar transcripción"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Editar</span>
            </button>
          )}

          {activeTab === "literal" && (
            <button
              onClick={handleCopyLiteral}
              className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/40 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
              title="Copiar transcripción literal al portapapeles"
            >
              {copiedLiteral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedLiteral ? "¡Copiado!" : "Copiar Literal"}</span>
            </button>
          )}

          {activeTab === "normalized" && (
            <button
              onClick={handleCopyNormalized}
              className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/40 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
              title="Copiar versión normalizada en español moderno"
            >
              {copiedNormalized ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedNormalized ? "¡Copiado!" : "Copiar Normalizado"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editing Assistant Toolbar */}
      {isEditing && (
        <div className="bg-amber-950/80 px-4 py-2 border-b border-amber-800/40 flex items-center justify-between flex-wrap gap-2 text-xs text-amber-200">
          <span className="font-serif italic font-medium text-amber-300">
            Herramientas paleográficas de edición:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => insertTag("[dudoso: ]")}
              className="bg-stone-800 hover:bg-amber-900 text-amber-200 border border-amber-700/50 px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer"
            >
              + [dudoso: palabra]
            </button>
            <button
              onClick={() => insertTag("[ilegible]")}
              className="bg-stone-800 hover:bg-rose-900 text-rose-200 border border-rose-700/50 px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer"
            >
              + [ilegible]
            </button>
            <button
              onClick={() => insertTag("[interlineado: ]")}
              className="bg-stone-800 hover:bg-amber-900 text-amber-200 border border-amber-700/50 px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer"
            >
              + [interlineado]
            </button>
            <button
              onClick={() => insertTag("[ic]")}
              className="bg-stone-800 hover:bg-amber-900 text-amber-200 border border-amber-700/50 px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer"
            >
              + [ ] Corchetes
            </button>
          </div>
        </div>
      )}

      {/* Main Tab View Contents */}
      <div className="flex-1 overflow-auto p-4 bg-stone-950/90 text-stone-200 font-serif">
        
        {/* TAB 1: LITERAL TRANSCRIPTION */}
        {activeTab === "literal" && (
          <div className="space-y-4">
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-300/90 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 font-serif">Criterios Paleográficos Aplicados:</strong>
                <p className="mt-0.5 text-stone-300">
                  Respeta saltos de línea originales. Mantiene grafías de época (ç, v/u, x/j, ff, ss). Despliega abreviaturas entre{" "}
                  <span className="text-amber-400 font-mono font-bold">[corchetes rectos]</span>. Mantiene mayúsculas y minúsculas originales.
                </p>
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={editableLiteral}
                onChange={(e) => setEditableLiteral(e.target.value)}
                rows={20}
                className="w-full bg-stone-900 text-amber-100 border border-amber-800/60 rounded-lg p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <div className="bg-stone-900/90 border border-amber-900/30 rounded-lg p-5 font-serif leading-relaxed text-amber-100/90 text-sm whitespace-pre-wrap font-normal selection:bg-amber-800/60 shadow-inner">
                {editableLiteral.split("\n").map((line, idx) => {
                  const lineNum = idx + 1;
                  const isSelected = selectedLineNumber === lineNum;
                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectLine(lineNum)}
                      className={`flex items-start gap-3 hover:bg-amber-950/40 p-1.5 rounded transition-colors cursor-pointer ${
                        isSelected ? "bg-amber-900/50 border-l-4 border-amber-400 pl-2 font-medium text-amber-100" : ""
                      }`}
                    >
                      <span className="font-mono text-xs text-amber-500/70 select-none w-8 text-right shrink-0 pt-0.5">
                        {lineNum}
                      </span>
                      <div className="flex-1 font-mono text-xs sm:text-sm text-amber-100/95">
                        {renderHighlightedLiteral(line)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NORMALIZED VERSION */}
        {activeTab === "normalized" && (
          <div className="space-y-4">
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-300/90 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 font-serif">Versión Normalizada en Español Moderno:</strong>
                <p className="mt-0.5 text-stone-300">
                  Ajustada a la ortografía, acentuación, puntuación y sintaxis del castellano actual conforme a las directrices del Archivo General de Indias y la RAE para facilitar el análisis histórico y legal.
                </p>
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={editableNormalized}
                onChange={(e) => setEditableNormalized(e.target.value)}
                rows={20}
                className="w-full bg-stone-900 text-amber-100 border border-amber-800/60 rounded-lg p-4 font-serif text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <div className="bg-stone-900/90 border border-amber-900/30 rounded-lg p-6 font-serif leading-relaxed text-stone-200 text-sm whitespace-pre-wrap selection:bg-amber-800/60 shadow-inner">
                {editableNormalized}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LINE BY LINE TABLE */}
        {activeTab === "linebyline" && (
          <div className="space-y-3">
            <div className="text-xs text-amber-300/80 mb-2">
              Cotejo directo entre el texto literal transcrito y la versión adaptada en español moderno.
            </div>

            <div className="overflow-x-auto border border-amber-900/40 rounded-lg shadow-inner">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-800 text-amber-200 font-serif border-b border-amber-900/40">
                    <th className="p-2.5 w-12 text-center font-mono">Línea</th>
                    <th className="p-2.5 font-mono">Transcripción Paleográfica Literal</th>
                    <th className="p-2.5 font-serif">Versión Normalizada</th>
                    <th className="p-2.5 w-40 font-serif">Notas de Lectura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/20 font-sans">
                  {document.lineByLine.map((line) => {
                    const isSelected = selectedLineNumber === line.lineNumber;
                    return (
                      <tr
                        key={line.lineNumber}
                        onClick={() => onSelectLine(line.lineNumber)}
                        className={`hover:bg-amber-950/40 transition-colors cursor-pointer ${
                          isSelected ? "bg-amber-900/40 text-amber-100" : "text-stone-300"
                        }`}
                      >
                        <td className="p-2.5 text-center font-mono text-amber-500 font-semibold bg-stone-900/50">
                          {line.lineNumber}
                        </td>
                        <td className="p-2.5 font-mono text-amber-100/95 leading-relaxed">
                          {renderHighlightedLiteral(line.literal)}
                        </td>
                        <td className="p-2.5 font-serif text-stone-200 leading-relaxed">
                          {line.normalized}
                        </td>
                        <td className="p-2.5 text-amber-400/80 text-[11px] italic font-serif">
                          {line.notes || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ARCHIVAL METADATA */}
        {activeTab === "metadata" && (
          <div className="space-y-4">
            <div className="bg-stone-900 border border-amber-800/50 rounded-lg p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-amber-800/40 pb-3">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-amber-100">
                  {document.archivalMetadata.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
                <div className="bg-stone-950/60 p-3 rounded border border-amber-900/30 space-y-1">
                  <span className="text-amber-400 font-semibold uppercase font-mono text-[10px]">
                    Archivo Histórico
                  </span>
                  <p className="text-amber-100 text-sm font-medium">
                    {document.archivalMetadata.archive}
                  </p>
                </div>

                <div className="bg-stone-950/60 p-3 rounded border border-amber-900/30 space-y-1">
                  <span className="text-amber-400 font-semibold uppercase font-mono text-[10px]">
                    Sección / Fondo / Legajo
                  </span>
                  <p className="text-amber-100 text-sm font-medium">
                    {document.archivalMetadata.section} ({document.archivalMetadata.signature})
                  </p>
                </div>

                <div className="bg-stone-950/60 p-3 rounded border border-amber-900/30 space-y-1">
                  <span className="text-amber-400 font-semibold uppercase font-mono text-[10px]">
                    Fecha del Documento
                  </span>
                  <p className="text-amber-100 text-sm font-medium">
                    {document.archivalMetadata.date}
                  </p>
                </div>

                <div className="bg-stone-950/60 p-3 rounded border border-amber-900/30 space-y-1">
                  <span className="text-amber-400 font-semibold uppercase font-mono text-[10px]">
                    Tipología Scriptural
                  </span>
                  <p className="text-amber-100 text-sm font-medium">
                    {document.archivalMetadata.scriptType}
                  </p>
                </div>
              </div>

              <div className="bg-stone-950/60 p-4 rounded border border-amber-900/30 space-y-2 text-xs">
                <span className="text-amber-400 font-semibold uppercase font-mono text-[10px]">
                  Resumen de Contenido & Relevancia Histórica
                </span>
                <p className="text-stone-300 leading-relaxed font-serif text-sm">
                  {document.archivalMetadata.summary}
                </p>
              </div>

              {/* Detected Paleographical Abbreviations */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                  Abreviaturas Paleográficas del Documento ({document.abbreviationsList.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {document.abbreviationsList.map((abbr, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-950/70 border border-amber-900/30 p-2 rounded flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="text-amber-300 font-bold">{abbr.abbreviation}</span>
                        <span className="text-amber-500 font-sans mx-1">→</span>
                        <span className="text-amber-100 font-bold">{abbr.expansion}</span>
                        <p className="text-[11px] text-stone-400 font-serif mt-0.5">{abbr.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer bar */}
      <div className="bg-stone-900/90 px-4 py-2 border-t border-amber-900/30 text-xs text-amber-400/80 flex items-center justify-between font-serif">
        <span>Líneas totales: {editableLiteral.split("\n").length}</span>
        <span>Abreviaturas resueltas entre [ ]</span>
      </div>
    </div>
  );
};
