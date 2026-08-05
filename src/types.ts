export interface LineItem {
  lineNumber: number;
  literal: string;
  normalized: string;
  notes?: string;
  status?: "ok" | "dudoso" | "ilegible";
}

export interface AbbreviationItem {
  abbreviation: string;
  expansion: string;
  meaning: string;
  century?: string;
  scriptType?: string;
}

export interface ArchivalMetadata {
  title: string;
  archive: string; // e.g. "Archivo General de Indias (AGI), Sevilla"
  section: string; // e.g. "Santo Domingo / Indiferente General"
  signature: string; // e.g. "AGI, Santo Domingo, Leg. 868"
  date: string; // e.g. "29 de febrero de 1597 (Registro 1597-1608)"
  scriptType: string; // e.g. "Procesal encadenada / Humanística cancilleresca"
  reign: string; // e.g. "Felipe II / Felipe III"
  summary: string;
}

export interface ManuscriptDocument {
  id: string;
  title: string;
  imageUrl: string;
  archivalMetadata: ArchivalMetadata;
  literalTranscription: string;
  normalizedVersion: string;
  lineByLine: LineItem[];
  abbreviationsList: AbbreviationItem[];
}

export interface PaleographicTerm {
  symbol: string;
  expansion: string;
  meaning: string;
  period: string;
  category: "Gobernación" | "Hacienda" | "Religioso" | "Judicial" | "General";
  example: string;
}
