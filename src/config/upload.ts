// Upload limits shared by the browser and the server, so both sides enforce the
// same ceiling and show the user the same number.
//
// Measured on the decoded bytes — the original file — not on its base64
// representation, which is ~33% larger.
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB

// Human-readable form of the limit, for UI copy and error messages.
export const MAX_SIZE_LABEL = `${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB`;
