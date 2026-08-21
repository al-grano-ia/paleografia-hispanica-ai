import React from "react";
import { ManuscriptDocument } from "../types";
import { BookOpen, FileText, Search, Sparkles, Upload, Download, ShieldCheck, HelpCircle } from "lucide-react";

interface HeaderProps {
  currentDocument: ManuscriptDocument | null;
  documentsList: ManuscriptDocument[];
  onSelectDocument: (doc: ManuscriptDocument) => void;
  activeTab: "transcription" | "dictionary" | "ai" | "guide";
  setActiveTab: (tab: "transcription" | "dictionary" | "ai" | "guide") => void;
  onOpenUpload: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDocument,
  documentsList,
  onSelectDocument,
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenExport,
}) => {
  return (
    <header className="bg-stone-900 text-amber-50 border-b border-amber-900/40 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-2.5 rounded-lg border border-amber-600/30 shadow-inner">
              <BookOpen className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif font-bold tracking-wide text-amber-100">
                  Paleografía Hispánica
                </h1>
                <span className="bg-amber-950/80 text-amber-400 border border-amber-700/50 text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                  AGI & Simancas
                </span>
              </div>
              <p className="text-xs text-amber-300/70 font-sans">
                Transcripción paleográfica literal, abreviaturas y norma moderna (SS. XV-XVIII)
              </p>
            </div>
          </div>

          {/* Document Switcher & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Hidden until there is something to switch between: with no document
                the select would render empty and have no valid value. */}
            {currentDocument && (
              <div className="relative">
                <select
                  className="bg-stone-800 text-amber-100 text-xs font-serif rounded-md border border-amber-800/50 px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer max-w-[260px] truncate"
                  value={currentDocument.id}
                  onChange={(e) => {
                    const doc = documentsList.find((d) => d.id === e.target.value);
                    if (doc) onSelectDocument(doc);
                  }}
                >
                  {documentsList.map((doc) => (
                    <option key={doc.id} value={doc.id} className="bg-stone-900 text-amber-100">
                      {doc.archivalMetadata.signature} - {doc.title.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs font-medium px-3 py-2 rounded-md border border-amber-600/40 transition-colors shadow-sm cursor-pointer"
              title="Cargar nuevo manuscrito histórico"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Nuevo Manuscrito</span>
            </button>

            <button
              onClick={onOpenExport}
              disabled={!currentDocument}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-medium px-3 py-2 rounded-md border border-stone-700 transition-colors shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-stone-800"
              title={
                currentDocument
                  ? "Exportar transcripción"
                  : "Sube y analiza un manuscrito para poder exportarlo"
              }
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 mt-3 border-t border-amber-900/30 pt-2 font-serif text-sm">
          <button
            onClick={() => setActiveTab("transcription")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "transcription"
                ? "bg-amber-800 text-amber-100 font-semibold shadow-inner border border-amber-600/50"
                : "text-amber-300/80 hover:bg-stone-800 hover:text-amber-100"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Transcripción y Estudio</span>
          </button>

          <button
            onClick={() => setActiveTab("dictionary")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "dictionary"
                ? "bg-amber-800 text-amber-100 font-semibold shadow-inner border border-amber-600/50"
                : "text-amber-300/80 hover:bg-stone-800 hover:text-amber-100"
            }`}
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>Diccionario Abreviaturas</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-amber-800 text-amber-100 font-semibold shadow-inner border border-amber-600/50"
                : "text-amber-300/80 hover:bg-stone-800 hover:text-amber-100"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Asistente Paleógrafo Gemini AI</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "guide"
                ? "bg-amber-800 text-amber-100 font-semibold shadow-inner border border-amber-600/50"
                : "text-amber-300/80 hover:bg-stone-800 hover:text-amber-100"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Guía de Grafías & Archivos</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
