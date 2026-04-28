"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUploadUrl, confirmUpload } from "@/actions/upload";
import { UPLOAD_LIMITS } from "@/constants";

type FileStatus = "pending" | "uploading" | "done" | "error";

interface StagedFile {
  localId: string;
  file: File;
  status: FileStatus;
  error?: string;
  persistedId?: string;
}

interface ExistingFile {
  id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
}

interface UploadFormProps {
  caseId: string;
  existingFiles: ExistingFile[];
  onDeleteFile?: (fileId: string) => Promise<{ error?: string }>;
}

const STORAGE_BUCKET = "case-files";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function inferMimeType(file: File): string {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const ext = file.name.toLowerCase().split(".").pop();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    heic: "image/heic",
    pdf: "application/pdf",
  };
  return map[ext ?? ""] ?? file.type;
}

export function UploadForm({ caseId, existingFiles, onDeleteFile }: UploadFormProps) {
  const router = useRouter();
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showRemoveNotice, setShowRemoveNotice] = useState(false);
  const batchId = useRef(crypto.randomUUID()).current;
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const visibleExistingFiles = existingFiles.filter((f) => !removedIds.has(f.id));

  const isUploading = stagedFiles.some(
    (f) => f.status === "uploading" || f.status === "pending",
  );
  const uploadedCount =
    visibleExistingFiles.length +
    stagedFiles.filter((f) => f.status === "done").length;

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setValidationErrors([]);

    const incoming = Array.from(fileList);
    const activeCount = stagedFiles.filter(
      (f) => f.status !== "error",
    ).length;

    if (activeCount + incoming.length > UPLOAD_LIMITS.MAX_FILES_PER_BATCH) {
      setValidationErrors([
        `You can upload up to ${UPLOAD_LIMITS.MAX_FILES_PER_BATCH} files at a time.`,
      ]);
      resetInputs();
      return;
    }

    const valid: StagedFile[] = [];
    const errors: string[] = [];

    for (const file of incoming) {
      const mime = inferMimeType(file);
      if (!UPLOAD_LIMITS.ALLOWED_MIME_TYPES.includes(mime)) {
        errors.push(`${file.name}: File type not supported`);
        continue;
      }
      if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name}: Exceeds 15 MB limit`);
        continue;
      }
      if (file.size === 0) {
        errors.push(`${file.name}: File is empty`);
        continue;
      }
      valid.push({
        localId: crypto.randomUUID(),
        file,
        status: "pending",
      });
    }

    if (errors.length > 0) setValidationErrors(errors);
    if (valid.length > 0) {
      setStagedFiles((prev) => [...prev, ...valid]);
      for (const staged of valid) {
        processUpload(staged);
      }
    }

    resetInputs();
  }

  function resetInputs() {
    if (cameraRef.current) cameraRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  }

  async function openCamera() {
    setValidationErrors([]);
    if (!navigator.mediaDevices?.getUserMedia) {
      setValidationErrors([
        "Camera access is not available in this browser. Please use \u201cUpload PDF / file\u201d instead.",
      ]);
      return;
    }
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setValidationErrors([
          "No camera was found on this device. Please use \u201cUpload PDF / file\u201d to select a file.",
        ]);
      } else if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setValidationErrors([
          "Camera permission was denied. Please allow camera access in your browser settings, then try again.",
        ]);
      } else {
        setValidationErrors([
          "Unable to access the camera. Please check that no other app is using it, then try again.",
        ]);
      }
    }
  }

  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const dt = new DataTransfer();
        dt.items.add(file);
        addFiles(dt.files);
        closeCamera();
      },
      "image/jpeg",
      0.92,
    );
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  async function processUpload(staged: StagedFile) {
    const setStatus = (status: FileStatus, error?: string) => {
      setStagedFiles((prev) =>
        prev.map((f) =>
          f.localId === staged.localId ? { ...f, status, error } : f,
        ),
      );
    };

    setStatus("uploading");
    const mime = inferMimeType(staged.file);

    try {
      const urlResult = await getUploadUrl({
        caseId,
        fileName: staged.file.name,
        mimeType: mime,
        sizeBytes: staged.file.size,
      });

      if (urlResult.error) {
        setStatus("error", urlResult.error);
        return;
      }

      const { fileId, token, path } = urlResult;
      if (!fileId || !token || !path) {
        setStatus("error", "Failed to prepare upload.");
        return;
      }

      const supabase = createClient();
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .uploadToSignedUrl(path, token, staged.file);

      if (storageError) {
        setStatus("error", "Upload failed. Please try again.");
        return;
      }

      const result = await confirmUpload({
        caseId,
        fileId,
        storagePath: path,
        originalFilename: staged.file.name,
        mimeType: mime,
        sizeBytes: staged.file.size,
        batchId,
      });

      if (result.error) {
        setStatus("error", result.error);
        return;
      }

      setStagedFiles((prev) =>
        prev.map((f) =>
          f.localId === staged.localId
            ? { ...f, status: "done", persistedId: result.id }
            : f,
        ),
      );
    } catch {
      setStatus("error", "Something went wrong. Please try again.");
    }
  }

  async function handleDeleteExisting(fileId: string) {
    if (!onDeleteFile || removingId) return;
    setRemovingId(fileId);
    setRemovedIds((prev) => new Set([...prev, fileId]));
    const result = await onDeleteFile(fileId);
    if (result?.error) {
      setRemovedIds((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
      setRemovingId(null);
      return;
    }
    // Pull the refreshed existingFiles prop from the server so the list
    // stays in sync once the optimistic hide is released. Without this,
    // revalidatePath() in the server action does not reliably re-render
    // this route in production, which leaves the deleted row visible.
    router.refresh();
    setShowRemoveNotice(true);
    setRemovingId(null);
  }

  function retryUpload(localId: string) {
    const staged = stagedFiles.find((f) => f.localId === localId);
    if (!staged || staged.status !== "error") return;
    processUpload(staged);
  }

  function removeStaged(localId: string) {
    setStagedFiles((prev) => prev.filter((f) => f.localId !== localId));
  }

  const hasFiles = visibleExistingFiles.length > 0 || stagedFiles.length > 0;

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Upload Documents
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Supporting documents help our team review your case faster. If you do
          not have documents ready, you can continue without uploading.
        </p>
      </div>

      <p className="flex items-start gap-2 rounded-lg bg-accent-light px-4 py-3 text-xs leading-relaxed text-muted">
        <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        Secure document upload. Private case review. You can anonymize documents before sending them.
      </p>

      {/* File selection */}
      <div className="grid grid-cols-2 gap-3">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={openCamera}
          disabled={isUploading}
          className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface px-4 py-5 text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent-light disabled:pointer-events-none disabled:opacity-50"
        >
          <CameraIcon className="h-6 w-6 text-accent" />
          Take photo
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,application/pdf,.jpg,.jpeg,.png,.heic,.pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface px-4 py-5 text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent-light disabled:pointer-events-none disabled:opacity-50"
        >
          <DocumentIcon className="h-6 w-6 text-accent" />
          Upload PDF / file
        </button>
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <ul className="space-y-1 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {validationErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {/* File list */}
      {hasFiles && (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {visibleExistingFiles.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 px-4 py-3 text-sm"
            >
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-success" />
              <span className="min-w-0 flex-1 truncate text-foreground">
                {f.original_filename}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {formatBytes(f.size_bytes)}
              </span>
              {onDeleteFile && (
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(f.id)}
                  disabled={removingId !== null}
                  className="shrink-0 text-xs text-muted hover:text-error transition-colors disabled:opacity-40"
                  aria-label={`Remove ${f.original_filename}`}
                >
                  {removingId === f.id ? "…" : "Remove"}
                </button>
              )}
            </li>
          ))}
          {stagedFiles.map((f) => (
            <li
              key={f.localId}
              className="flex items-center gap-3 px-4 py-3 text-sm"
            >
              <StatusIcon status={f.status} />
              <div className="min-w-0 flex-1">
                <span className="block truncate text-foreground">
                  {f.file.name}
                </span>
                {f.status === "error" && f.error && (
                  <span className="block text-xs text-error">{f.error}</span>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted">
                {formatBytes(f.file.size)}
              </span>
              {f.status === "done" && f.persistedId && onDeleteFile && (
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(f.persistedId!)}
                  disabled={removingId !== null}
                  className="shrink-0 text-xs text-muted hover:text-error transition-colors disabled:opacity-40"
                  aria-label={`Remove ${f.file.name}`}
                >
                  {removingId === f.persistedId ? "…" : "Remove"}
                </button>
              )}
              {f.status === "error" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => retryUpload(f.localId)}
                    className="text-xs font-medium text-accent hover:text-accent/80"
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStaged(f.localId)}
                    className="text-xs text-muted hover:text-error"
                    aria-label={`Remove ${f.file.name}`}
                  >
                    &times;
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Remove notice */}
      {showRemoveNotice && (
        <p className="text-xs text-muted">
          This file has been removed. It may still appear here until you refresh the page.
        </p>
      )}

      {/* Batch counter */}
      {stagedFiles.length > 0 && (
        <p className="text-xs text-muted">
          {stagedFiles.filter((f) => f.status !== "error").length} of{" "}
          {UPLOAD_LIMITS.MAX_FILES_PER_BATCH} files in this upload
        </p>
      )}

      {/* Continue */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => router.push(`/case/${caseId}/checkout`)}
          disabled={isUploading}
          className="block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition bg-cta text-white hover:bg-cta-hover disabled:pointer-events-none disabled:bg-border disabled:text-muted"
        >
          {isUploading
            ? "Uploading\u2026"
            : uploadedCount > 0
              ? "Continue to review"
              : "Continue without uploads"}
        </button>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-lg">
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el && streamRef.current) {
                  el.srcObject = streamRef.current;
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg"
            />
            <div className="mt-6 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-lg px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/40 bg-white transition hover:bg-white/80"
                aria-label="Take photo"
              >
                <CameraIcon className="h-6 w-6 text-black/70" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons — small, self-contained, no external dependency  */
/* ------------------------------------------------------------------ */

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm9 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StatusIcon({ status }: { status: FileStatus }) {
  switch (status) {
    case "pending":
      return (
        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-border" />
      );
    case "uploading":
      return (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      );
    case "done":
      return <CheckCircleIcon className="h-4 w-4 shrink-0 text-success" />;
    case "error":
      return (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
          !
        </span>
      );
  }
}
