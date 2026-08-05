import React, { useState, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Eye,
  Sliders,
  Search,
  Maximize2,
  Grid,
} from "lucide-react";

interface DocumentViewerProps {
  imageUrl: string;
  title: string;
  signature: string;
  selectedLineNumber?: number | null;
  onSelectLine?: (lineNum: number) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  imageUrl,
  title,
  signature,
  selectedLineNumber,
}) => {
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(110);
  const [invert, setInvert] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, imgX: 0, imgY: 0 });
  const [showControls, setShowControls] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showMagnifier || !containerRef.current || !imageRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imgRect = imageRef.current.getBoundingClientRect();
    const imgX = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    const imgY = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    setMagnifierPos({ x, y, imgX, imgY });
  };

  const resetFilters = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(110);
    setInvert(false);
    setGrayscale(false);
  };

  const imageFilterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) ${
      invert ? "invert(100%)" : ""
    } ${grayscale ? "grayscale(100%)" : ""}`,
    transform: `scale(${zoom})`,
    transformOrigin: "center top",
    transition: "transform 0.1s ease-out, filter 0.2s ease",
  };

  return (
    <div className="bg-stone-900 border border-amber-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[550px]">
      
      {/* Top Bar / Controls Header */}
      <div className="bg-stone-800/90 px-4 py-2 border-b border-amber-900/30 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">
            {signature}
          </span>
          <span className="text-amber-200/90 font-serif truncate max-w-[200px] sm:max-w-[320px]">
            {title}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Zoom Buttons */}
          <div className="flex items-center bg-stone-900 rounded border border-amber-900/40 p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.25))}
              className="p-1 hover:bg-amber-900/40 rounded text-amber-300 transition-colors"
              title="Alejar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-amber-200">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="p-1 hover:bg-amber-900/40 rounded text-amber-300 transition-colors"
              title="Acercar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lupa / Magnifier toggle */}
          <button
            onClick={() => setShowMagnifier(!showMagnifier)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-xs transition-colors cursor-pointer ${
              showMagnifier
                ? "bg-amber-700 text-amber-100 border-amber-500 font-medium"
                : "bg-stone-900 text-amber-300/80 border-amber-900/40 hover:bg-stone-800"
            }`}
            title="Lupa paleográfica interactiva"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lupa</span>
          </button>

          {/* Invert contrast toggle */}
          <button
            onClick={() => setInvert(!invert)}
            className={`p-1.5 rounded border text-xs transition-colors cursor-pointer ${
              invert
                ? "bg-amber-700 text-amber-100 border-amber-500"
                : "bg-stone-900 text-amber-300/80 border-amber-900/40 hover:bg-stone-800"
            }`}
            title="Invertir colores (Modo negativo para tinta desgastada)"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Filter Sliders Toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-1.5 rounded border text-xs transition-colors cursor-pointer ${
              showControls
                ? "bg-amber-800 text-amber-100 border-amber-600"
                : "bg-stone-900 text-amber-300/80 border-amber-900/40 hover:bg-stone-800"
            }`}
            title="Ajustes de imagen (Brillo / Contraste)"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetFilters}
            className="p-1.5 rounded bg-stone-900 text-amber-300/80 border border-amber-900/40 hover:bg-stone-800 transition-colors cursor-pointer"
            title="Restablecer vista"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Image Adjustment Controls */}
      {showControls && (
        <div className="bg-stone-800/95 px-4 py-2 border-b border-amber-900/30 flex items-center gap-6 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Brillo:</span>
            <input
              type="range"
              min="50"
              max="180"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono w-8">{brightness}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Contraste:</span>
            <input
              type="range"
              min="80"
              max="250"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono w-8">{contrast}%</span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={grayscale}
              onChange={(e) => setGrayscale(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Escala de Grises</span>
          </label>
        </div>
      )}

      {/* Main Image Viewport Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowMagnifier(showMagnifier)}
        className="relative flex-1 overflow-auto bg-stone-950 p-4 flex items-center justify-center min-h-[480px] cursor-crosshair select-none"
      >
        <div className="relative inline-block max-w-full shadow-2xl rounded border border-amber-900/30 bg-stone-900">
          <img
            ref={imageRef}
            src={imageUrl}
            alt={title}
            style={imageFilterStyle}
            className="max-h-[75vh] w-auto object-contain block rounded"
          />

          {/* Line highlight overlay if line is selected */}
          {selectedLineNumber && (
            <div className="absolute left-2 top-2 bg-amber-900/90 text-amber-100 px-2 py-1 rounded text-xs font-mono border border-amber-500 shadow-md">
              Línea {selectedLineNumber} seleccionada
            </div>
          )}
        </div>

        {/* Magnifier Lens Overlay */}
        {showMagnifier && (
          <div
            className="absolute pointer-events-none rounded-full border-2 border-amber-400 shadow-2xl bg-stone-900 overflow-hidden z-30"
            style={{
              width: "160px",
              height: "160px",
              left: `${magnifierPos.x - 80}px`,
              top: `${magnifierPos.y - 80}px`,
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: `${magnifierPos.imgX}% ${magnifierPos.imgY}%`,
              backgroundSize: `${350 * zoom}%`,
              filter: `brightness(${brightness}%) contrast(${contrast + 30}%) ${
                invert ? "invert(100%)" : ""
              }`,
            }}
          >
            {/* Crosshair guide inside magnifier */}
            <div className="absolute inset-0 border border-amber-500/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full border border-amber-400 bg-amber-400/20" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="bg-stone-900/90 px-4 py-1.5 border-t border-amber-900/30 text-[11px] text-amber-400/70 flex items-center justify-between font-mono">
        <span>
          {showMagnifier ? "Lupa paleográfica activada (Pasa el cursor sobre la tinta)" : "Haz clic o usa la lupa para examinar trazos y ligado de letras"}
        </span>
        <span className="hidden sm:inline text-amber-500/80">AGI / Simancas (SS. XV-XVIII)</span>
      </div>
    </div>
  );
};
