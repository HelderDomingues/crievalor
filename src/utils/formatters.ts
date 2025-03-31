
/**
 * Formats a number as currency
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string without currency symbol
 */
export const formatCurrency = (value: number, decimals = 2): string => {
  if (typeof value !== 'number') return '0';
  
  return value.toFixed(decimals).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formats a date string to a localized date format
 * @param dateString - The date string to format
 * @param locale - The locale to use (default: 'pt-BR')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | null, locale = 'pt-BR'): string => {
  if (!dateString) return 'N/A';
  
  return new Date(dateString).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formats a phone number string into (XX) XXXXX-XXXX
 * @param value The phone number as a string of digits
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
}

/**
 * Sanitizes a phone number by removing all non-digit characters
 * @param value The phone number string to sanitize
 */
export function sanitizePhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validates if a phone number has the correct format and length
 * @param value The phone number to validate
 */
export function isValidPhoneNumber(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  // Valid phone has 10 or 11 digits (with area code)
  return digits.length >= 10 && digits.length <= 11;
}
