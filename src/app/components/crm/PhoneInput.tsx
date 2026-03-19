/* ============================================================
 * PhoneInput Component
 * International phone number input with country selection
 * ============================================================ */

import { useCallback } from "react";
import {
  PhoneInput as ReactPhoneInput,
  type CountryIso2,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/* ============================================================
 * Types
 * ============================================================ */

export interface PhoneInputProps {
  value?: string;
  onChange?: (phone: string, country: CountryIso2) => void;
  defaultCountry?: CountryIso2;
  preferredCountries?: CountryIso2[];
  disabled?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

export interface PhoneInputValue {
  phone: string;
  country: CountryIso2;
  isValid: boolean;
}

/* ============================================================
 * Default Configuration
 * ============================================================ */

const DEFAULT_COUNTRY: CountryIso2 = "us";
const PREFERRED_COUNTRIES: CountryIso2[] = ["us", "gb", "ca", "au", "vn", "jp", "kr", "cn"];

/* ============================================================
 * Utility Functions
 * ============================================================ */

export function parsePhoneNumber(phone: string): {
  countryCode: string;
  nationalNumber: string;
  country?: CountryIso2;
} {
  // Simple parsing - for production use a library like libphonenumber-js
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("1") && cleaned.length === 11) {
    // North American numbers
    return {
      countryCode: "1",
      nationalNumber: cleaned.slice(1),
      country: "us",
    };
  }

  if (cleaned.startsWith("84")) {
    // Vietnam
    return {
      countryCode: "84",
      nationalNumber: cleaned.slice(2),
      country: "vn",
    };
  }

  if (cleaned.startsWith("44")) {
    // UK
    return {
      countryCode: "44",
      nationalNumber: cleaned.slice(2),
      country: "gb",
    };
  }

  return {
    countryCode: "",
    nationalNumber: cleaned,
  };
}

export function formatPhoneNumber(
  phone: string,
  country?: CountryIso2
): string {
  // Basic formatting - for production use a proper library
  const cleaned = phone.replace(/\D/g, "");

  if (!country || country === "us") {
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === "1") {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }

  return phone;
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic validation - for production use libphonenumber-js
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/* ============================================================
 * PhoneInput Component
 * ============================================================ */

export function PhoneInput({
  value = "",
  onChange,
  defaultCountry = DEFAULT_COUNTRY,
  preferredCountries = PREFERRED_COUNTRIES,
  disabled = false,
  error,
  label,
  placeholder = "Enter phone number",
  className,
  inputClassName,
  required = false,
}: PhoneInputProps) {
  const handleChange = useCallback(
    (phone: string, meta: { country: CountryIso2 }) => {
      onChange?.(phone, meta.country);
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <ReactPhoneInput
          value={value}
          onChange={handleChange}
          defaultCountry={defaultCountry}
          preferredCountries={preferredCountries}
          disabled={disabled}
          placeholder={placeholder}
          inputClassName={cn(
            "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            inputClassName
          )}
          countrySelectorStyleProps={{
            buttonClassName: cn(
              "h-10 border border-gray-300 dark:border-gray-700 rounded-l-md",
              disabled && "opacity-50 cursor-not-allowed"
            ),
            dropdownStyleProps: {
              className: "bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg",
              listItemClassName: "hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2",
            },
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/* ============================================================
 * Formatted Phone Display
 * ============================================================ */

export interface PhoneDisplayProps {
  value: string;
  country?: CountryIso2;
  className?: string;
  showFlag?: boolean;
}

export function PhoneDisplay({
  value,
  country,
  className,
  showFlag = true,
}: PhoneDisplayProps) {
  const formatted = formatPhoneNumber(value, country);
  const countryData = country ? parseCountry(defaultCountries.find(c => c[1] === country)) : null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showFlag && countryData && (
        <span className="text-xl">{countryData.emoji}</span>
      )}
      <span className="font-mono">{formatted}</span>
    </div>
  );
}

/* ============================================================
 * Phone Input with Validation
 * ============================================================ */

export interface ValidatedPhoneInputProps extends PhoneInputProps {
  onValidationChange?: (isValid: boolean) => void;
  showValidation?: boolean;
}

export function ValidatedPhoneInput({
  value,
  onChange,
  onValidationChange,
  showValidation = true,
  error: externalError,
  ...props
}: ValidatedPhoneInputProps) {
  const isValid = value ? validatePhoneNumber(value) : true;

  const handleChange = useCallback(
    (phone: string, country: CountryIso2) => {
      onChange?.(phone, country);
      const valid = validatePhoneNumber(phone);
      onValidationChange?.(valid);
    },
    [onChange, onValidationChange]
  );

  const error = externalError || (showValidation && value && !isValid
    ? "Invalid phone number"
    : undefined);

  return (
    <PhoneInput
      value={value}
      onChange={handleChange}
      error={error}
      {...props}
    />
  );
}
