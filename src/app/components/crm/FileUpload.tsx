/* ============================================================
 * FileUpload Component
 * File upload with drag-drop, preview, and validation
 * ============================================================ */

import { useCallback, useState, useRef } from "react";
import {
  Upload,
  X,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ValidationDisplay } from "./ValidationDisplay";

/* ============================================================
 * Types
 * ============================================================ */

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
  uploaded?: boolean;
}

export interface FileUploadProps {
  value?: File | File[];
  onChange?: (files: File | File[] | null) => void;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
  // Display options
  variant?: "default" | "compact" | "avatar";
  showPreview?: boolean;
  showProgress?: boolean;
  // Messages
  uploadText?: string;
  browseText?: string;
  dragText?: string;
}

/* ============================================================
 * Constants
 * ============================================================ */

const FILE_TYPE_ICONS: Record<string, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  pdf: FileText,
  zip: Archive,
  default: File,
};

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

/* ============================================================
 * Utility Functions
 * ============================================================ */

function getFileType(file: File): string {
  const type = file.type.split("/")[0];
  if (["image", "video", "audio"].includes(type)) return type;
  if (file.type === "application/pdf") return "pdf";
  if (
    file.type === "application/zip" ||
    file.type === "application/x-zip-compressed"
  )
    return "zip";
  return "default";
}

function getFileIcon(file: File) {
  const type = getFileType(file);
  return FILE_TYPE_ICONS[type] || FILE_TYPE_ICONS.default;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function createFilePreview(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => resolve(undefined);
    reader.readAsDataURL(file);
  });
}

function validateFile(
  file: File,
  accept?: string,
  maxSize?: number
): string | null {
  // Check file type
  if (accept) {
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    const fileType = file.type;
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    const isAccepted = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileExtension === type.toLowerCase();
      }
      if (type.endsWith("/*")) {
        const category = type.split("/")[0];
        return fileType.startsWith(category);
      }
      return fileType === type;
    });

    if (!isAccepted) {
      return `File type not accepted. Please upload: ${accept}`;
    }
  }

  // Check file size
  const maxFileSize = maxSize ?? DEFAULT_MAX_SIZE;
  if (file.size > maxFileSize) {
    return `File size exceeds ${formatFileSize(maxFileSize)}`;
  }

  return null;
}

/* ============================================================
 * FilePreview Component
 * ============================================================ */

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
  showProgress?: boolean;
  disabled?: boolean;
}

function FilePreview({
  file,
  onRemove,
  showProgress,
  disabled,
}: FilePreviewProps) {
  const Icon = getFileIcon(file.file);
  const isImage = file.file.type.startsWith("image/");

  return (
    <div className="relative group border rounded-lg p-3 bg-white dark:bg-gray-950">
      {/* Preview */}
      <div className="flex items-start gap-3">
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.file.name}
            className="w-12 h-12 object-cover rounded flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-gray-500" />
          </div>
        )}

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.file.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(file.file.size)}
          </p>

          {/* Progress */}
          {showProgress && file.progress !== undefined && file.progress < 100 && (
            <Progress value={file.progress} className="mt-2 h-1" />
          )}

          {/* Error */}
          {file.error && (
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{file.error}</span>
            </div>
          )}
        </div>

        {/* Remove Button */}
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * FileUpload Component
 * ============================================================ */

export function FileUpload({
  value,
  onChange,
  onUpload,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  error,
  className,
  variant = "default",
  showPreview = true,
  showProgress = true,
  uploadText = "Upload files",
  browseText = "Browse",
  dragText = "or drag and drop",
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ============================================================
   * File Processing
   * ============================================================ */

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      // Check max files
      if (maxFiles && uploadedFiles.length + fileArray.length > maxFiles) {
        return;
      }

      // Validate and create uploaded files
      const newFiles: UploadedFile[] = [];

      for (const file of fileArray) {
        const validationError = validateFile(file, accept, maxSize);
        const preview = await createFilePreview(file);

        newFiles.push({
          id: Math.random().toString(36),
          file,
          preview,
          error: validationError ?? undefined,
          progress: validationError ? undefined : 0,
          uploaded: false,
        });
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Upload files if handler provided
      if (onUpload) {
        const validFiles = newFiles.filter((f) => !f.error);
        if (validFiles.length > 0) {
          try {
            await onUpload(validFiles.map((f) => f.file));
            setUploadedFiles((prev) =>
              prev.map((f) =>
                validFiles.some((vf) => vf.id === f.id)
                  ? { ...f, progress: 100, uploaded: true }
                  : f
              )
            );
          } catch (err) {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                validFiles.some((vf) => vf.id === f.id)
                  ? {
                      ...f,
                      error:
                        err instanceof Error
                          ? err.message
                          : "Upload failed",
                    }
                  : f
              )
            );
          }
        }
      }

      // Call onChange
      if (onChange) {
        const allFiles = [...uploadedFiles, ...newFiles].map((f) => f.file);
        onChange(multiple ? allFiles : allFiles[0] ?? null);
      }
    },
    [uploadedFiles, onChange, onUpload, accept, maxSize, maxFiles, multiple]
  );

  /* ============================================================
   * Event Handlers
   * ============================================================ */

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [disabled, processFiles]
  );

  const handleRemove = useCallback(
    (id: string) => {
      setUploadedFiles((prev) => {
        const newFiles = prev.filter((f) => f.id !== id);
        if (onChange) {
          const files = newFiles.map((f) => f.file);
          onChange(multiple ? files : files[0] ?? null);
        }
        return newFiles;
      });
    },
    [onChange, multiple]
  );

  const handleBrowseClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  /* ============================================================
   * Render
   * ============================================================ */

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : "border-gray-300 dark:border-gray-700",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm">
              <Button
                type="button"
                variant="link"
                onClick={handleBrowseClick}
                disabled={disabled}
                className="p-0 h-auto"
              >
                {browseText}
              </Button>
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                {dragText}
              </span>
            </p>
            {accept && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Accepted: {accept}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Max size: {formatFileSize(maxSize)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* File Previews */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <FilePreview
              key={file.id}
              file={file}
              onRemove={() => handleRemove(file.id)}
              showProgress={showProgress}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <ValidationDisplay error={error} variant="inline" />}
    </div>
  );
}
