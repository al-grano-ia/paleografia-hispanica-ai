import React from "react";
import { BookOpen, Shield, Landmark, Scroll, Info, CheckCircle2 } from "lucide-react";

export const ArchivalGuideModal: React.FC = () => {
  return (
    <div className="bg-stone-900 border border-amber-900/40 rounded-xl p-6 shadow-2xl text-stone-200 font-serif space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-amber-900/40 pb-4">
        <div className="bg-amber-900/50 p-3 rounded-lg border border-amber-700/40">
          <BookOpen className="w-6 h-6 text-amber-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-100">
            Guía Paleográfica & Archivística Hispánica (Siglos XV-XVIII)
          </h2>
          <p className="text-xs text-amber-300/70 font-sans">
            Normas de trascripción, tipos de letra de escribanía y estructura de fondos de Indias y Simancas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
        
        {/* Column 1: Types of Script */}
        <div className="bg-stone-950/80 p-5 rounded-lg border border-amber-900/30 space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-900/30 pb-2">
            <Scroll className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-100">
              Tipologías Scripturales (Escribanía Real y Notarial)
            </h3>
          </div>

          <div className="space-y-3 font-serif">
            <div className="bg-stone-900 p-3 rounded border border-amber-900/20">
              <span className="font-bold text-amber-300 text-sm block">Escritura Cortesana (s. XV - I mitad s. XVI)</span>
              <p className="text-stone-300 text-xs mt-1">
                Libraria e higiénica, trazos apretados y redondeados. Utilizada en las cancillerías de los Reyes Católicos y Carlos I. Abundantes ligaduras, pero bastante legible.
              </p>
            </div>

            <div className="bg-stone-900 p-3 rounded border border-amber-900/20">
              <span className="font-bold text-amber-300 text-sm block">Escritura Procesal (s. XVI)</span>
              <p className="text-stone-300 text-xs mt-1">
                Derivada de la cortesana para acelerar la escritura en juicios y pleitos. Trazos caóticos, de gran velocidad y deformación tipográfica. Abundancia de nexos.
              </p>
            </div>

            <div className="bg-stone-900 p-3 rounded border border-amber-900/20">
              <span className="font-bold text-amber-300 text-sm block">Escritura Procesal Encadenada (s. XVI - XVII)</span>
              <p className="text-stone-300 text-xs mt-1">
                Llamada familiarmente "letra de encadenar" o "procesal de atar". El escribano no levanta la pluma del papel durante renglones enteros. Considerada por los paleógrafos como la más compleja.
              </p>
            </div>

            <div className="bg-stone-900 p-3 rounded border border-amber-900/20">
              <span className="font-bold text-amber-300 text-sm block">Escritura Humanística o Itálica (s. XVI - XVIII)</span>
              <p className="text-stone-300 text-xs mt-1">
                Influencia del Renacimiento italiano. Trazo claro, inclinado, de letras sueltas y proporciones regulares. Empleada en correspondencia diplomática y Reales Cédulas de Felipe II y Felipe III.
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Norms and Archives */}
        <div className="bg-stone-950/80 p-5 rounded-lg border border-amber-900/30 space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-900/30 pb-2">
            <Landmark className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-100">
              Normas de Transcripción & Archivos
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-stone-900 p-3 rounded border border-amber-900/20 space-y-1">
              <span className="font-bold text-amber-200 block text-xs">Criterios de Transcripción Paleográfica Literal:</span>
              <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px] pl-1">
                <li>Respeto estricto a los saltos de línea del manuscrito.</li>
                <li>Uso de corchetes <code className="bg-stone-950 px-1 rounded text-amber-300 font-mono">[ ]</code> para el despliegue de abreviaturas.</li>
                <li>Inclusión de etiquetas <code className="bg-stone-950 px-1 rounded text-rose-300 font-mono">[ilegible]</code> y <code className="bg-stone-950 px-1 rounded text-amber-300 font-mono">[dudoso: ]</code>.</li>
                <li>Conservación de grafías antiguas como <code className="font-mono text-amber-200">ç</code>, <code className="font-mono text-amber-200">u/v</code>, <code className="font-mono text-amber-200">x</code> (sonido /ʃ/), <code className="font-mono text-amber-200">ff</code> y <code className="font-mono text-amber-200">ss</code>.</li>
              </ul>
            </div>

            <div className="bg-stone-900 p-3 rounded border border-amber-900/20 space-y-1">
              <span className="font-bold text-amber-200 block text-xs">Archivo General de Indias (AGI), Sevilla:</span>
              <p className="text-stone-300 text-[11px]">
                Creado por Carlos III en 1785 en la Casa Lonja de Mercaderes de Sevilla. Centraliza la documentación de los organismos de gobierno indiano: Patronato Real, Casa de la Contratación, Real Consejo de las Indias, Audiencias y Escribanía de Cámara.
              </p>
            </div>

            <div className="bg-stone-900 p-3 rounded border border-amber-900/20 space-y-1">
              <span className="font-bold text-amber-200 block text-xs">Archivo General de Simancas (AGS), Valladolid:</span>
              <p className="text-stone-300 text-[11px]">
                Fundado por Carlos I en 1540 y organizado por Felipe II en 1588 en el Castillo de Simancas. Custodia los fondos del gobierno de la Monarquía Hispánica en Europa: Estado, Guerra, Hacienda, Cámara de Castilla y Patronato Real.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
