import React, { useState } from "react";
import { SAMPLE_MANUSCRIPTS } from "./data/sampleManuscripts";
import { ManuscriptDocument, LineItem } from "./types";
import { Header } from "./components/Header";
import { DocumentViewer } from "./components/DocumentViewer";
import { TranscriptionPanel } from "./components/TranscriptionPanel";
import { PaleographicDictionary } from "./components/PaleographicDictionary";
import { AiAnalysisModal } from "./components/AiAnalysisModal";
import { ArchivalGuideModal } from "./components/ArchivalGuideModal";
import { ExportModal } from "./components/ExportModal";

export default function App() {
  const [documentsList, setDocumentsList] = useState<ManuscriptDocument[]>(SAMPLE_MANUSCRIPTS);
  const [currentDocument, setCurrentDocument] = useState<ManuscriptDocument>(SAMPLE_MANUSCRIPTS[0]);
  const [selectedLineNumber, setSelectedLineNumber] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"transcription" | "dictionary" | "ai" | "guide">("transcription");
  const [showExportModal, setShowExportModal] = useState(false);

  const handleUpdateTranscription = (
    newLiteral: string,
    newNormalized: string,
    newLines: LineItem[]
  ) => {
    const updatedDoc: ManuscriptDocument = {
      ...currentDocument,
      literalTranscription: newLiteral,
      normalizedVersion: newNormalized,
      lineByLine: newLines,
    };

    setCurrentDocument(updatedDoc);
    setDocumentsList((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
  };

  const handleAnalysisComplete = (newDoc: ManuscriptDocument) => {
    setDocumentsList((prev) => [newDoc, ...prev]);
    setCurrentDocument(newDoc);
    setActiveTab("transcription");
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-serif selection:bg-amber-900 selection:text-amber-100">
      
      {/* App Navigation Header */}
      <Header
        currentDocument={currentDocument}
        documentsList={documentsList}
        onSelectDocument={(doc) => {
          setCurrentDocument(doc);
          setSelectedLineNumber(null);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setActiveTab("ai")}
        onOpenExport={() => setShowExportModal(true)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 p-3 sm:p-5 max-w-[1700px] w-full mx-auto">
        
        {activeTab === "transcription" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[700px]">
            
            {/* Left Column: Interactive Manuscript Scan Viewer (6 cols) */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <DocumentViewer
                imageUrl={currentDocument.imageUrl}
                title={currentDocument.archivalMetadata.title}
                signature={currentDocument.archivalMetadata.signature}
                selectedLineNumber={selectedLineNumber}
                onSelectLine={(num) => setSelectedLineNumber(num)}
              />
            </div>

            {/* Right Column: Transcription & Normalization Panel (6 cols) */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <TranscriptionPanel
                document={currentDocument}
                selectedLineNumber={selectedLineNumber}
                onSelectLine={(num) => setSelectedLineNumber(num)}
                onUpdateTranscription={handleUpdateTranscription}
              />
            </div>

          </div>
        )}

        {/* Tab: Paleographic Dictionary */}
        {activeTab === "dictionary" && (
          <div className="max-w-6xl mx-auto">
            <PaleographicDictionary />
          </div>
        )}

        {/* Tab: Gemini AI Paleographer */}
        {activeTab === "ai" && (
          <div className="max-w-6xl mx-auto">
            <AiAnalysisModal
              currentDocument={currentDocument}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {/* Tab: Archival & Writing Styles Guide */}
        {activeTab === "guide" && (
          <div className="max-w-6xl mx-auto">
            <ArchivalGuideModal />
          </div>
        )}

      </main>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          document={currentDocument}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-amber-900/30 bg-stone-900/80 py-3 px-6 text-center text-xs text-amber-400/60 font-mono">
        Paleografía Hispánica • Archivo General de Indias (AGI), Simancas y Archivo Histórico Nacional (SS. XV - XVIII)
      </footer>
    </div>
  );
}
