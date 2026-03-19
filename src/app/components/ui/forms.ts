/**
 * Form Components Module
 * 
 * Exports all advanced form components for easy importing:
 * - FloatingInput: Material Design floating label inputs
 * - MaskedInput: Inputs with formatting (phone, currency, date, etc.)
 * - ValidatedInput: Real-time validation with visual feedback
 * - MultiStepForm: Multi-step form wizard with progress
 * - FormProgress: Standalone form completion indicator
 * - Autocomplete: Typeahead/autocomplete with async search
 * - TagsInput: Multi-tag input with suggestions
 * - FileUpload: File upload with drag-drop and progress
 * - ImageUpload: Image upload with crop/preview
 * - Rating: Star/icon rating component
 * - Slider: Range slider with tooltips
 * - ColorPicker: Color picker with presets and HSL
 * - DateRangePicker: Date range picker with presets
 * - MultiSelect: Multi-select dropdown with search
 * - Combobox: Combobox with search and dropdown
 * - FormField, FormFieldGroup, FormSection: Form field components for layout
 * 
 * @example
 * ```tsx
 * import { 
 *   FloatingInput, 
 *   MaskedInput, 
 *   ValidatedInput, 
 *   MultiStepForm,
 *   FormProgress,
 *   Autocomplete,
 *   TagsInput,
 *   FileUpload,
 *   ImageUpload,
 *   Rating,
 *   Slider,
 *   ColorPicker,
 *   DateRangePicker,
 *   MultiSelect,
 *   Combobox,
 *   FormField,
 *   FormFieldGroup,
 *   FormSection
 * } from '@/app/components/ui/forms';
 * ```
 */

export { FloatingInput } from './floating-input';
export type { FloatingInputProps } from './floating-input';

export { MaskedInput } from './masked-input';
export type { MaskedInputProps, MaskType } from './masked-input';

export { ValidatedInput, validators } from './validated-input';
export type { ValidatedInputProps, ValidationRule, ValidatorFunction } from './validated-input';

export { MultiStepForm } from './multi-step-form';
export type { MultiStepFormProps, FormStep } from './multi-step-form';

export { FormProgress, useFormProgress } from './form-progress';
export type { FormProgressProps, FormField, UseFormProgressOptions } from './form-progress';

export { Autocomplete } from './autocomplete';
export type { AutocompleteProps, AutocompleteOption } from './autocomplete';

export { TagsInput } from './tags-input';
export type { TagsInputProps, Tag } from './tags-input';

export { FileUpload } from './file-upload';
export type { FileUploadProps, UploadedFile } from './file-upload';

export { ImageUpload } from './image-upload';
export type { ImageUploadProps, CropArea } from './image-upload';

export { Rating } from './rating';
export type { RatingProps } from './rating';

export { Slider } from './slider';
export type { SliderProps } from './slider';

export { ColorPicker } from './color-picker';
export type { ColorPickerProps } from './color-picker';

export { DateRangePicker } from './date-range-picker';
export type { DateRangePickerProps, DateRange, DateRangePreset } from './date-range-picker';

export { MultiSelect } from './multi-select';
export type { MultiSelectProps, MultiSelectOption } from './multi-select';

export { Combobox } from './combobox';
export type { ComboboxProps, ComboboxOption } from './combobox';

export { FormField, FormFieldGroup, FormSection } from './form-field';
export type { FormFieldProps, FormFieldGroupProps, FormSectionProps } from './form-field';