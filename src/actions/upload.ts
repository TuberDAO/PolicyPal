"use server";

/**
 * Upload server actions — createSignedUploadUrl, deleteFile.
 * Generates signed upload URLs for Supabase Storage.
 * Enforces: ownership, draft/awaiting_info status, 10 files per batch, 15 MB, allowed MIME types.
 * Implementation will be added in the upload phase.
 */
