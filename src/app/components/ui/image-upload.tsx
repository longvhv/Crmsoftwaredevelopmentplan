import * as React from "react";
import { cn } from "./utils";
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Crop, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * IMAGE UPLOAD WITH CROP/PREVIEW PROPS
 * ============================================================
 * Advanced image upload with built-in cropping, rotation, and zoom
 * No external dependencies - pure React canvas implementation
 */

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageUploadProps {
  /**
   * Selected image URL or base64
   */
  value?: string;
  
  /**
   * Default image (uncontrolled)
   */
  defaultValue?: string;
  
  /**
   * Aspect ratio for cropping (width/height)
   * Examples: 1 (square), 16/9 (landscape), 4/3, etc.
   * @default undefined (free crop)
   */
  aspectRatio?: number;
  
  /**
   * Maximum file size in bytes
   * @default 5MB
   */
  maxSize?: number;
  
  /**
   * Output image width (resize after crop)
   * @default 800
   */
  outputWidth?: number;
  
  /**
   * Output image quality (0-1)
   * @default 0.9
   */
  outputQuality?: number;
  
  /**
   * Output format
   * @default 'image/jpeg'
   */
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
  
  /**
   * Show crop controls
   * @default true
   */
  showCrop?: boolean;
  
  /**
   * Show rotation controls
   * @default true
   */
  showRotation?: boolean;
  
  /**
   * Show zoom controls
   * @default true
   */
  showZoom?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Variant
   * @default 'default'
   */
  variant?: 'default' | 'circle' | 'rounded';
  
  /**
   * Change callback (receives cropped image as base64)
   */
  onChange?: (imageData: string | null) => void;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
}

/* ============================================================
 * IMAGE EDITOR STATE
 * ============================================================ */

interface ImageEditorState {
  zoom: number;
  rotation: number;
  cropArea: CropArea;
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

/* ============================================================
 * IMAGE UPLOAD COMPONENT
 * ============================================================ */

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      value: valueProp,
      defaultValue,
      aspectRatio,
      maxSize = 5 * 1024 * 1024, // 5MB
      outputWidth = 800,
      outputQuality = 0.9,
      outputFormat = 'image/jpeg',
      showCrop = true,
      showRotation = true,
      showZoom = true,
      disabled = false,
      variant = 'default',
      onChange,
      className,
      helperText,
      error,
    },
    ref
  ) => {
    const [imageUrl, setImageUrl] = React.useState<string | null>(valueProp || defaultValue || null);
    const [originalImage, setOriginalImage] = React.useState<HTMLImageElement | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    
    const [editorState, setEditorState] = React.useState<ImageEditorState>({
      zoom: 1,
      rotation: 0,
      cropArea: { x: 0, y: 0, width: 100, height: 100 },
      isDragging: false,
      dragStart: { x: 0, y: 0 },
    });
    
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const previewCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
    
    const isControlled = valueProp !== undefined;
    const currentImageUrl = isControlled ? valueProp : imageUrl;
    
    // Load image
    const loadImage = (file: File) => {
      // Validate file size
      if (file.size > maxSize) {
        setUploadError(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          setOriginalImage(img);
          
          // Initialize crop area
          const imgAspect = img.width / img.height;
          const targetAspect = aspectRatio || imgAspect;
          
          let cropWidth = img.width;
          let cropHeight = img.height;
          
          if (aspectRatio) {
            if (imgAspect > targetAspect) {
              cropWidth = img.height * targetAspect;
            } else {
              cropHeight = img.width / targetAspect;
            }
          }
          
          setEditorState({
            zoom: 1,
            rotation: 0,
            cropArea: {
              x: (img.width - cropWidth) / 2,
              y: (img.height - cropHeight) / 2,
              width: cropWidth,
              height: cropHeight,
            },
            isDragging: false,
            dragStart: { x: 0, y: 0 },
          });
          
          setIsEditing(true);
          setUploadError(null);
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    };
    
    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        loadImage(file);
      }
      
      // Reset input
      e.target.value = '';
    };
    
    // Draw image on canvas
    const drawCanvas = React.useCallback(() => {
      if (!originalImage || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const { zoom, rotation } = editorState;
      
      // Set canvas size
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save context
      ctx.save();
      
      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.translate(-originalImage.width / 2, -originalImage.height / 2);
      
      // Draw image
      ctx.drawImage(originalImage, 0, 0);
      
      // Restore context
      ctx.restore();
      
      // Draw crop overlay
      if (showCrop) {
        const { x, y, width, height } = editorState.cropArea;
        
        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Clear crop area
        ctx.clearRect(x, y, width, height);
        
        // Redraw image in crop area
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-originalImage.width / 2, -originalImage.height / 2);
        ctx.drawImage(originalImage, 0, 0);
        ctx.restore();
        
        // Crop border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Corner handles
        const handleSize = 8;
        ctx.fillStyle = '#ffffff';
        
        // Top-left
        ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
        // Top-right
        ctx.fillRect(x + width - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
        // Bottom-left
        ctx.fillRect(x - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
        // Bottom-right
        ctx.fillRect(x + width - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
      }
    }, [originalImage, editorState, showCrop]);
    
    // Update canvas when state changes
    React.useEffect(() => {
      drawCanvas();
    }, [drawCanvas]);
    
    // Apply crop and save
    const applyCrop = () => {
      if (!originalImage || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Create output canvas
      const outputCanvas = document.createElement('canvas');
      const outputCtx = outputCanvas.getContext('2d');
      if (!outputCtx) return;
      
      const { x, y, width, height } = editorState.cropArea;
      const { zoom, rotation } = editorState;
      
      // Calculate output size maintaining aspect ratio
      const aspectRatioValue = aspectRatio || width / height;
      let outWidth = outputWidth;
      let outHeight = outputWidth / aspectRatioValue;
      
      outputCanvas.width = outWidth;
      outputCanvas.height = outHeight;
      
      // Draw cropped and transformed image
      outputCtx.save();
      outputCtx.translate(outWidth / 2, outHeight / 2);
      outputCtx.rotate((rotation * Math.PI) / 180);
      outputCtx.scale(zoom, zoom);
      
      const scale = outWidth / width;
      outputCtx.drawImage(
        originalImage,
        x, y, width, height,
        -outWidth / 2, -outHeight / 2, outWidth, outHeight
      );
      
      outputCtx.restore();
      
      // Convert to base64
      const croppedImageData = outputCanvas.toDataURL(outputFormat, outputQuality);
      
      if (!isControlled) {
        setImageUrl(croppedImageData);
      }
      
      onChange?.(croppedImageData);
      setIsEditing(false);
    };
    
    // Cancel editing
    const cancelEditing = () => {
      setIsEditing(false);
      setOriginalImage(null);
    };
    
    // Remove image
    const removeImage = () => {
      if (!isControlled) {
        setImageUrl(null);
      }
      
      onChange?.(null);
      setOriginalImage(null);
      setIsEditing(false);
    };
    
    // Zoom controls
    const handleZoomIn = () => {
      setEditorState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 3) }));
    };
    
    const handleZoomOut = () => {
      setEditorState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }));
    };
    
    // Rotation
    const handleRotate = () => {
      setEditorState((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
    };
    
    // Trigger file input
    const triggerFileInput = () => {
      inputRef.current?.click();
    };
    
    // Variant classes
    const previewClasses = cn(
      'relative w-full bg-[var(--muted)] flex items-center justify-center overflow-hidden',
      variant === 'circle' && 'aspect-square rounded-full',
      variant === 'rounded' && 'aspect-video rounded-lg',
      variant === 'default' && 'aspect-video rounded-lg'
    );
    
    return (
      <div className={cn('w-full space-y-3', className)}>
        {/* Hidden File Input */}
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Image Editor Modal */}
        {isEditing && originalImage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Edit Image</h3>
                <button
                  onClick={cancelEditing}
                  className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Canvas */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[var(--muted)]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full border border-border"
                />
              </div>
              
              {/* Controls */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex items-center justify-between gap-4">
                  {/* Transform Controls */}
                  <div className="flex items-center gap-2">
                    {showZoom && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleZoomOut}
                          disabled={editorState.zoom <= 0.5}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground min-w-12 text-center">
                          {Math.round(editorState.zoom * 100)}%
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleZoomIn}
                          disabled={editorState.zoom >= 3}
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {showRotation && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRotate}
                        leftIcon={<RotateCw className="w-4 h-4" />}
                      >
                        Rotate
                      </Button>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={applyCrop}
                      leftIcon={<Check className="w-4 h-4" />}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Preview / Upload Area */}
        <div className={previewClasses}>
          {currentImageUrl ? (
            <>
              <img
                src={currentImageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Controls */}
              {!disabled && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className="bg-background"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="bg-background"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={disabled}
              className={cn(
                'w-full h-full flex flex-col items-center justify-center p-6 transition-colors',
                !disabled && 'hover:bg-[var(--muted)]/80 cursor-pointer',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mb-3',
                'bg-primary/10'
              )}>
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Upload Image
              </p>
              <p className="text-xs text-muted-foreground">
                Click to browse
              </p>
            </button>
          )}
        </div>
        
        {/* Helper Text / Error */}
        {(error || uploadError || helperText) && (
          <p className={cn(
            'text-xs',
            (error || uploadError) ? 'text-[var(--error)]' : 'text-muted-foreground'
          )}>
            {error || uploadError || helperText}
          </p>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export { ImageUpload };
