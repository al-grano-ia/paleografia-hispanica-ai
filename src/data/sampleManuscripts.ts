import { ManuscriptDocument } from "../types";

// Deliberately empty.
//
// The two documents that used to live here came from the original prototype and
// none of their content could be verified: one image URL returned 404 on
// Wikimedia Commons, the other was unrelated stock photography, and the second
// document's archival record (Felipe II, AGS Estado Leg. 254, 1571) did not even
// match its own transcription (Pedro de la Gasca, Peru, c. 1550). Shipping
// invented signatures and attributions as if they were archival fact is worse
// than shipping no examples at all.
//
// To add an example back, every entry needs a verifiable origin: the holding
// institution, the exact signature, the URL the scan comes from, its licence and
// the credit line that licence requires. Record all of it in the README, under
// "Créditos de imágenes".
//
// The removed content is still in the history:
//   git show 90c095c:src/data/sampleManuscripts.ts
export const SAMPLE_MANUSCRIPTS: ManuscriptDocument[] = [];
