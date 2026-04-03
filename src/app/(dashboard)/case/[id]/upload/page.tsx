import type { Metadata } from "next";

export const metadata: Metadata = { title: "Upload Documents" };

/**
 * Upload page — optional document upload before checkout.
 * Uploads are authenticated (post-sign-in). Max 10 files per batch, 15 MB each.
 * Allowed: JPG, PNG, HEIC, PDF.
 * Implementation will be added in the upload phase.
 */
export default function UploadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;
  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Upload Documents
      </h1>
      <p className="text-sm text-muted">
        Upload zone will appear here. You can also skip this step.
      </p>
    </div>
  );
}
