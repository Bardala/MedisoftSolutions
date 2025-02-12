export function isArabic(str: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(str);
}
