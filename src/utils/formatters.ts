
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
