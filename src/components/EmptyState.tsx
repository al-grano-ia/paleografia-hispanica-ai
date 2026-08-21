import React from "react";
import { Upload, Search, HelpCircle, ScrollText } from "lucide-react";
import { MAX_SIZE_LABEL } from "../config/upload";

interface EmptyStateProps {
  onOpenUpload: () => void;
  onOpenDictionary: () => void;
  onOpenGuide: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenUpload,
  onOpenDictionary,
  onOpenGuide,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-10 sm:py-16 px-2">
      <div className="bg-stone-900 border border-amber-900/40 rounded-xl shadow-2xl p-6 sm:p-10 text-center space-y-6">
        <div className="inline-flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-950 p-4 rounded-full border border-amber-600/40 shadow-inner">
          <ScrollText className="w-8 h-8 text-amber-200" />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif">
            Aún no hay ningún manuscrito en el área de trabajo
          </h2>
          <p className="text-sm text-stone-300 font-sans leading-relaxed max-w-xl mx-auto">
            Esta demostración no incluye manuscritos de ejemplo. Las imágenes y fichas
            archivísticas del prototipo original no tenían procedencia verificada, así que se
            retiraron en lugar de publicarlas como si fueran documentación real.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 font-medium px-6 py-3 rounded-lg shadow-lg border border-amber-600/50 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-300" />
            <span className="text-sm">Subir un escaneo</span>
          </button>
          <p className="text-[11px] text-stone-400 font-mono">
            JPG, PNG o WebP · máximo {MAX_SIZE_LABEL}
          </p>
        </div>

        <div className="pt-4 border-t border-amber-900/30 space-y-3">
          <p className="text-xs text-amber-300/80 font-sans">
            Mientras tanto, estas dos secciones no necesitan ningún documento:
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={onOpenDictionary}
              className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-medium px-4 py-2.5 rounded-md border border-stone-700 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Diccionario de abreviaturas</span>
            </button>
            <button
              onClick={onOpenGuide}
              className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-medium px-4 py-2.5 rounded-md border border-stone-700 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Guía de grafías y archivos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
