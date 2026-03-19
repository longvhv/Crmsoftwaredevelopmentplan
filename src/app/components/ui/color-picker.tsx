import * as React from "react";
import { cn } from "./utils";
import { Check, Pipette, X } from "lucide-react";

/* ============================================================
 * COLOR PICKER PROPS
 * ============================================================
 * Color picker with preset colors, custom hex input, and HSL sliders
 * No external dependencies - pure React implementation
 */

export interface ColorPickerProps {
  /**
   * Current color value (hex, rgb, hsl)
   */
  value?: string;
  
  /**
   * Default color (uncontrolled)
   */
  defaultValue?: string;
  
  /**
   * Preset colors to display
   */
  presetColors?: string[];
  
  /**
   * Show preset colors
   * @default true
   */
  showPresets?: boolean;
  
  /**
   * Show hex input
   * @default true
   */
  showHexInput?: true;
  
  /**
   * Show HSL sliders
   * @default true
   */
  showSliders?: boolean;
  
  /**
   * Show alpha (transparency) control
   * @default false
   */
  showAlpha?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Variant
   * @default 'default'
   */
  variant?: 'default' | 'compact' | 'button';
  
  /**
   * Change callback
   */
  onChange?: (color: string) => void;
  
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
 * DEFAULT PRESET COLORS
 * ============================================================ */

const DEFAULT_PRESETS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
  '#F43F5E', '#64748B',
];

/* ============================================================
 * COLOR UTILITIES
 * ============================================================ */

interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

// Hex to RGB
const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: result[4] ? parseInt(result[4], 16) / 255 : 1,
      }
    : null;
};

// RGB to Hex
const rgbToHex = (rgb: RGB): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}${rgb.a < 1 ? toHex(rgb.a * 255) : ''}`;
};

// HSL to RGB
const hslToRgb = (hsl: HSL): RGB => {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
    a: hsl.a,
  };
};

// RGB to HSL
const rgbToHsl = (rgb: RGB): HSL => {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
    a: rgb.a,
  };
};

// Hex to HSL
const hexToHsl = (hex: string): HSL => {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb) : { h: 0, s: 0, l: 0, a: 1 };
};

// HSL to Hex
const hslToHex = (hsl: HSL): string => {
  return rgbToHex(hslToRgb(hsl));
};

/* ============================================================
 * COLOR PICKER COMPONENT
 * ============================================================ */

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value: valueProp,
      defaultValue = '#3B82F6',
      presetColors = DEFAULT_PRESETS,
      showPresets = true,
      showHexInput = true,
      showSliders = true,
      showAlpha = false,
      disabled = false,
      variant = 'default',
      onChange,
      className,
      helperText,
      error,
    },
    ref
  ) => {
    const [color, setColor] = React.useState(valueProp || defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const [hexInput, setHexInput] = React.useState(color);
    
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    
    const isControlled = valueProp !== undefined;
    const currentColor = isControlled ? valueProp : color;
    const hsl = hexToHsl(currentColor);
    
    // Update color
    const updateColor = (newColor: string) => {
      if (disabled) return;
      
      if (!isControlled) {
        setColor(newColor);
      }
      
      setHexInput(newColor);
      onChange?.(newColor);
    };
    
    // Update HSL
    const updateHsl = (updates: Partial<HSL>) => {
      const newHsl = { ...hsl, ...updates };
      const newColor = hslToHex(newHsl);
      updateColor(newColor);
    };
    
    // Handle hex input
    const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Auto-add # if missing
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
      
      setHexInput(value);
      
      // Validate and update color
      if (/^#[0-9A-F]{6}([0-9A-F]{2})?$/i.test(value)) {
        updateColor(value);
      }
    };
    
    // Click outside to close
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);
    
    // Compact variant (button only)
    if (variant === 'compact' || variant === 'button') {
      return (
        <div ref={containerRef} className={cn('relative inline-block', className)}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-10 h-10 rounded-lg border-2 border-border transition-all',
              'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{ backgroundColor: currentColor }}
            aria-label="Pick color"
          />
          
          {/* Dropdown */}
          {isOpen && !disabled && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-xl p-4 min-w-[280px]">
              <ColorPickerContent
                color={currentColor}
                hsl={hsl}
                hexInput={hexInput}
                presetColors={presetColors}
                showPresets={showPresets}
                showHexInput={showHexInput}
                showSliders={showSliders}
                showAlpha={showAlpha}
                onColorChange={updateColor}
                onHslChange={updateHsl}
                onHexInputChange={handleHexInput}
              />
            </div>
          )}
        </div>
      );
    }
    
    // Default variant (inline)
    return (
      <div ref={ref} className={cn('w-full space-y-3', className)}>
        <ColorPickerContent
          color={currentColor}
          hsl={hsl}
          hexInput={hexInput}
          presetColors={presetColors}
          showPresets={showPresets}
          showHexInput={showHexInput}
          showSliders={showSliders}
          showAlpha={showAlpha}
          onColorChange={updateColor}
          onHslChange={updateHsl}
          onHexInputChange={handleHexInput}
          disabled={disabled}
        />
        
        {/* Helper / Error */}
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-[var(--error)]' : 'text-muted-foreground')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

/* ============================================================
 * COLOR PICKER CONTENT
 * ============================================================ */

interface ColorPickerContentProps {
  color: string;
  hsl: HSL;
  hexInput: string;
  presetColors: string[];
  showPresets: boolean;
  showHexInput: boolean;
  showSliders: boolean;
  showAlpha: boolean;
  onColorChange: (color: string) => void;
  onHslChange: (updates: Partial<HSL>) => void;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const ColorPickerContent: React.FC<ColorPickerContentProps> = ({
  color,
  hsl,
  hexInput,
  presetColors,
  showPresets,
  showHexInput,
  showSliders,
  showAlpha,
  onColorChange,
  onHslChange,
  onHexInputChange,
  disabled,
}) => {
  return (
    <>
      {/* Current Color Preview */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-16 h-16 rounded-lg border-2 border-border flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        
        {/* Hex Input */}
        {showHexInput && (
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Hex Color
            </label>
            <input
              type="text"
              value={hexInput}
              onChange={onHexInputChange}
              disabled={disabled}
              className={cn(
                'w-full px-3 py-2 text-sm rounded-lg border border-border bg-background',
                'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              placeholder="#000000"
            />
          </div>
        )}
      </div>
      
      {/* HSL Sliders */}
      {showSliders && (
        <div className="space-y-3 mb-4">
          {/* Hue */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Hue: {Math.round(hsl.h)}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={hsl.h}
              onChange={(e) => onHslChange({ h: Number(e.target.value) })}
              disabled={disabled}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                  hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
                  hsl(360, 100%, 50%))`,
              }}
            />
          </div>
          
          {/* Saturation */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Saturation: {Math.round(hsl.s)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.s}
              onChange={(e) => onHslChange({ s: Number(e.target.value) })}
              disabled={disabled}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hsl.h}, 0%, ${hsl.l}%), 
                  hsl(${hsl.h}, 100%, ${hsl.l}%))`,
              }}
            />
          </div>
          
          {/* Lightness */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Lightness: {Math.round(hsl.l)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.l}
              onChange={(e) => onHslChange({ l: Number(e.target.value) })}
              disabled={disabled}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hsl.h}, ${hsl.s}%, 0%), 
                  hsl(${hsl.h}, ${hsl.s}%, 50%), 
                  hsl(${hsl.h}, ${hsl.s}%, 100%))`,
              }}
            />
          </div>
          
          {/* Alpha */}
          {showAlpha && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Opacity: {Math.round(hsl.a * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.a * 100}
                onChange={(e) => onHslChange({ a: Number(e.target.value) / 100 })}
                disabled={disabled}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0), 
                    hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1))`,
                }}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Preset Colors */}
      {showPresets && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Preset Colors
          </label>
          <div className="grid grid-cols-10 gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => onColorChange(presetColor)}
                disabled={disabled}
                className={cn(
                  'w-full aspect-square rounded border-2 transition-all',
                  'hover:scale-110 focus:outline-none',
                  color.toUpperCase() === presetColor.toUpperCase()
                    ? 'border-foreground ring-2 ring-primary/20'
                    : 'border-border',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                style={{ backgroundColor: presetColor }}
                aria-label={`Color ${presetColor}`}
              >
                {color.toUpperCase() === presetColor.toUpperCase() && (
                  <Check className="w-3 h-3 mx-auto text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export { ColorPicker };
