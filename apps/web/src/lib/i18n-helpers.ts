/**
 * Extract localized text from a JSON field stored as { en: "...", de: "...", ... }
 * Falls back to "en" if the requested locale is not available.
 */
export function getLocalizedText(
  value: unknown,
  locale: string = 'en'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, string>;
    return obj[locale] || obj['en'] || Object.values(obj)[0] || '';
  }
  return String(value);
}
