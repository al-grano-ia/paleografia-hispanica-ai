import React, { useState } from "react";
import { PALEOGRAPHIC_DICTIONARY } from "../data/paleographicDictionary";
import { PaleographicTerm } from "../types";
import { Search, BookMarked, Filter, HelpCircle, Plus, X } from "lucide-react";

export const PaleographicDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [entries, setEntries] = useState<PaleographicTerm[]>(PALEOGRAPHIC_DICTIONARY);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<PaleographicTerm>({
    symbol: "",
    expansion: "",
    meaning: "",
    period: "Siglos XV-XVIII",
    category: "General",
    example: "",
  });

  const categories = ["All", "Gobernación", "Hacienda", "Religioso", "Judicial", "General"];

  const filteredTerms = entries.filter((term) => {
    const matchesSearch =
      term.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.expansion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.meaning.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreateEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newEntry.symbol.trim() || !newEntry.expansion.trim() || !newEntry.meaning.trim()) return;

    setEntries((currentEntries) => [
      { ...newEntry, symbol: newEntry.symbol.trim(), expansion: newEntry.expansion.trim(), meaning: newEntry.meaning.trim(), example: newEntry.example.trim() },
      ...currentEntries,
    ]);
    setNewEntry({ symbol: "", expansion: "", meaning: "", period: "Siglos XV-XVIII", category: "General", example: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="bg-stone-900 border border-amber-900/40 rounded-xl p-6 shadow-2xl text-stone-200 font-serif space-y-6">

      {/* TEMP: marcador de verificación — eliminar antes de commitear */}
      <div className="rounded-md border border-rose-500/60 bg-rose-950/50 px-3 py-1.5 text-center text-xs font-mono font-bold tracking-wider text-rose-200">
        PRUEBA CHECKPOINT
      </div>

      {/* Title */}
      <div className="flex items-center justify-between border-b border-amber-900/40 pb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-900/50 p-2.5 rounded-lg border border-amber-700/40">
            <BookMarked className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-100">
              Diccionario Paleográfico de Abreviaturas Hispánicas (SS. XV-XVIII)
            </h2>
            <p className="text-xs text-amber-300/70 font-sans">
              Repertorio de sigles, suspensiones, contracciones y nexos habituales en los fondos del Archivo General de Indias y Simancas.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-950 text-amber-400 font-mono text-xs px-3 py-1 rounded border border-amber-800">
            {filteredTerms.length} Abreviaturas
          </span>
          <button
            type="button"
            onClick={() => setIsCreateDialogOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/70 bg-amber-700 px-3 py-2 text-xs font-sans font-semibold text-amber-50 transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Crear entrada
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por símbolo, expansión ('dho', 'M.tad') o significado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 text-amber-100 placeholder-stone-500 text-xs font-mono pl-9 pr-4 py-2.5 rounded-lg border border-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1.5 rounded-md font-sans whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-800 text-amber-100 font-medium border border-amber-600/50"
                  : "bg-stone-800 text-amber-300/70 hover:bg-stone-700 hover:text-amber-100 border border-stone-700"
              }`}
            >
              {cat === "All" ? "Todas" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term, idx) => (
          <div
            key={idx}
            className="bg-stone-950/80 border border-amber-900/30 hover:border-amber-700/60 p-4 rounded-lg transition-all shadow-md space-y-2 group"
          >
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
              <span className="font-mono font-bold text-amber-300 text-sm group-hover:text-amber-200">
                {term.symbol}
              </span>
              <span className="bg-amber-950 text-amber-400/80 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-900">
                {term.category}
              </span>
            </div>

            <div>
              <div className="text-xs font-mono font-semibold text-amber-100">
                {term.expansion}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-serif mt-1">
                {term.meaning}
              </p>
            </div>

            {term.example && (
              <div className="bg-stone-900/90 p-2 rounded text-[11px] font-mono text-amber-200/80 border border-amber-900/20">
                <span className="text-amber-500 font-sans mr-1">Ej:</span>
                "{term.example}"
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 bg-stone-950/50 rounded-lg border border-amber-900/20 text-stone-400 space-y-2">
          <HelpCircle className="w-8 h-8 text-amber-500/50 mx-auto" />
          <p className="text-sm font-serif">No se encontraron abreviaturas para "{searchTerm}".</p>
          <p className="text-xs text-stone-500">Prueba buscando variantes como "dho", "q", "ntro", "c.da" o "M.tad".</p>
        </div>
      )}

      {isCreateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4" role="presentation">
          <div className="w-full max-w-xl rounded-xl border border-amber-700/50 bg-stone-900 p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="create-entry-title">
            <div className="mb-5 flex items-center justify-between border-b border-amber-900/40 pb-4">
              <div>
                <h3 id="create-entry-title" className="text-lg font-bold text-amber-100">Crear entrada</h3>
                <p className="mt-1 text-xs text-stone-400 font-sans">Añade una abreviatura al repertorio de esta sesión.</p>
              </div>
              <button type="button" onClick={() => setIsCreateDialogOpen(false)} aria-label="Cerrar" className="rounded-md p-1.5 text-stone-400 hover:bg-stone-800 hover:text-amber-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEntry} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(["symbol", "expansion"] as const).map((field) => (
                  <label key={field} className="space-y-1.5 text-xs text-amber-200">
                    {field === "symbol" ? "Símbolo" : "Expansión"} <span className="text-amber-500">*</span>
                    <input required value={newEntry[field]} onChange={(event) => setNewEntry({ ...newEntry, [field]: event.target.value })} className="w-full rounded-md border border-amber-900/60 bg-stone-950 px-3 py-2 text-sm text-amber-100 outline-none focus:border-amber-500" />
                  </label>
                ))}
              </div>
              <label className="block space-y-1.5 text-xs text-amber-200">Significado <span className="text-amber-500">*</span>
                <textarea required value={newEntry.meaning} onChange={(event) => setNewEntry({ ...newEntry, meaning: event.target.value })} rows={3} className="w-full resize-y rounded-md border border-amber-900/60 bg-stone-950 px-3 py-2 text-sm text-amber-100 outline-none focus:border-amber-500" />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs text-amber-200">Periodo
                  <input value={newEntry.period} onChange={(event) => setNewEntry({ ...newEntry, period: event.target.value })} className="w-full rounded-md border border-amber-900/60 bg-stone-950 px-3 py-2 text-sm text-amber-100 outline-none focus:border-amber-500" />
                </label>
                <label className="space-y-1.5 text-xs text-amber-200">Categoría
                  <select value={newEntry.category} onChange={(event) => setNewEntry({ ...newEntry, category: event.target.value as PaleographicTerm["category"] })} className="w-full rounded-md border border-amber-900/60 bg-stone-950 px-3 py-2 text-sm text-amber-100 outline-none focus:border-amber-500">
                    {categories.slice(1).map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
              </div>
              <label className="block space-y-1.5 text-xs text-amber-200">Ejemplo
                <input value={newEntry.example} onChange={(event) => setNewEntry({ ...newEntry, example: event.target.value })} className="w-full rounded-md border border-amber-900/60 bg-stone-950 px-3 py-2 text-sm text-amber-100 outline-none focus:border-amber-500" />
              </label>
              <div className="flex justify-end gap-2 border-t border-amber-900/40 pt-4">
                <button type="button" onClick={() => setIsCreateDialogOpen(false)} className="rounded-md border border-stone-700 px-3 py-2 text-xs text-stone-300 hover:bg-stone-800">Cancelar</button>
                <button type="submit" className="rounded-md bg-amber-700 px-3 py-2 text-xs font-semibold text-amber-50 hover:bg-amber-600">Guardar entrada</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
