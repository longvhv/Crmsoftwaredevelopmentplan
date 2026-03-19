import * as React from "react";
import { Upload, X, File, FileText, Image as ImageIcon, FileVideo, FileAudio, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { Progress } from "./progress";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
  preview?: string;
}

export interface FileUploadProps {
  // Value
  value?: File[];
  onChange?: (files: File[]) => void;
  
  // Display
  label?: string;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  
  // Features
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  showPreview?: boolean;
  disabled?: boolean;
  
  // Callbacks
  onUpload?: (file: File) => Promise<void>;
  onRemove?: (file: File) => void;
  
  // States
  error?: string;
  success?: string;
  
  // Styling
  fullWidth?: boolean;
  variant?: "default" | "compact";
  className?: string;
}

/* ============================================================
 * HELPERS
 * ============================================================ */

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFileIcon = (file: File) => {
  const type = file.type.split("/")[0];
  
  switch (type) {
    case "image":
      return <ImageIcon className="size-8 text-[var(--brand-primary)]" />;
    case "video":
      return <FileVideo className="size-8 text-blue-500" />;
    case "audio":
      return <FileAudio className="size-8 text-purple-500" />;
    case "text":
      return <FileText className="size-8 text-yellow-500" />;
    default:
      return <File className="size-8 text-muted-foreground" />;
  }
};

const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      value,
      onChange,
      label,
      helperText,
      required,
      optional,
      multiple = false,
      accept,
      maxSize = 10, // 10MB default
      maxFiles,
      showPreview = true,
      disabled = false,
      onUpload,
      onRemove,
      error,
      success,
      fullWidth = false,
      variant = "default",
      className,
    },
    ref
  ) => {
    const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const displayMessage = error || success || helperText;
    const state = error ? 'error' : success ? 'success' : 'default';

    // Generate file preview
    const generatePreview = async (file: File): Promise<string | undefined> => {
      if (!isImageFile(file)) return undefined;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    };

    // Validate file
    const validateFile = (file: File): { valid: boolean; error?: string } => {
      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        return { valid: false, error: `File size exceeds ${maxSize}MB` };
      }

      // Check file count
      if (maxFiles && uploadedFiles.length >= maxFiles) {
        return { valid: false, error: `Maximum ${maxFiles} files allowed` };
      }

      return { valid: true };
    };

    // Handle file selection
    const handleFiles = async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const filesToAdd = multiple ? fileArray : [fileArray[0]];

      for (const file of filesToAdd) {
        const validation = validateFile(file);
        
        if (!validation.valid) {
          // Add file with error
          const uploadedFile: UploadedFile = {
            id: `${Date.now()}-${file.name}`,
            file,
            progress: 0,
            status: "error",
            error: validation.error,
          };
          setUploadedFiles((prev) => [...prev, uploadedFile]);
          continue;
        }

        // Generate preview
        const preview = await generatePreview(file);

        // Add file
        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${file.name}`,
          file,
          progress: 0,
          status: "uploading",
          preview,
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);

        // Simulate upload or use provided onUpload
        if (onUpload) {
          try {
            await onUpload(file);
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id
                  ? { ...f, progress: 100, status: "success" as const }
                  : f
              )
            );
          } catch (err) {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id
                  ? {
                      ...f,
                      status: "error" as const,
                      error: "Upload failed",
                    }
                  : f
              )
            );
          }
        } else {
          // Simulate progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, progress } : f
              )
            );

            if (progress >= 100) {
              clearInterval(interval);
              setUploadedFiles((prev) =>
                prev.map((f) =>
                  f.id === uploadedFile.id
                    ? { ...f, status: "success" as const }
                    : f
                )
              );
            }
          }, 200);
        }
      }

      // Notify parent
      const allFiles = [...uploadedFiles.map((f) => f.file), ...filesToAdd];
      onChange?.(allFiles);
    };

    // Handle remove
    const handleRemove = (id: string) => {
      const fileToRemove = uploadedFiles.find((f) => f.id === id);
      if (fileToRemove) {
        onRemove?.(fileToRemove.file);
        setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
        
        const remainingFiles = uploadedFiles
          .filter((f) => f.id !== id)
          .map((f) => f.file);
        onChange?.(remainingFiles);
      }
    };

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!disabled) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", fullWidth && "w-full", className)}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-0.5 text-[var(--error)]">*</span>}
            {optional && (
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            )}
          </label>
        )}

        {/* Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-all duration-200",
            "cursor-pointer hover:border-[var(--brand-primary)]/50",
            variant === "default" ? "p-8" : "p-4",
            isDragging && "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-[var(--error)]",
            success && "border-[var(--success)]",
            !isDragging && !error && !success && "border-border"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled}
            className="hidden"
            aria-label="File upload"
          />

          {variant === "default" ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className={cn(
                "p-3 rounded-full",
                isDragging ? "bg-[var(--brand-primary)]/10" : "bg-accent"
              )}>
                <Upload className={cn(
                  "size-8",
                  isDragging ? "text-[var(--brand-primary)]" : "text-muted-foreground"
                )} />
              </div>
              
              <div>
                <p className="text-sm font-medium">
                  {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {accept || "Any file type"} • Max {maxSize}MB
                  {maxFiles && ` • Up to ${maxFiles} files`}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={disabled}
              >
                Browse Files
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Upload className="size-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isDragging ? "Drop files here" : "Click or drag files"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Max {maxSize}MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
              >
                Browse
              </Button>
            </div>
          )}
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border border-border bg-background",
                  "hover:bg-accent/50 transition-colors"
                )}
              >
                {/* Preview or Icon */}
                <div className="shrink-0">
                  {showPreview && uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="size-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center size-12 rounded bg-accent">
                      {getFileIcon(uploadedFile.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>

                    {/* Status Icon */}
                    {uploadedFile.status === "success" && (
                      <CheckCircle className="size-5 text-[var(--success)] shrink-0" />
                    )}
                    {uploadedFile.status === "error" && (
                      <AlertCircle className="size-5 text-[var(--error)] shrink-0" />
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(uploadedFile.id)}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="size-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {uploadedFile.status === "uploading" && (
                    <div className="mt-2">
                      <Progress value={uploadedFile.progress} size="sm" />
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadedFile.error && (
                    <p className="text-xs text-[var(--error)] mt-1">
                      {uploadedFile.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Helper Text */}
        {displayMessage && (
          <p
            className={cn(
              "text-xs",
              state === "error" && "text-[var(--error)]",
              state === "success" && "text-[var(--success)]",
              state === "default" && "text-muted-foreground"
            )}
          >
            {displayMessage}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
