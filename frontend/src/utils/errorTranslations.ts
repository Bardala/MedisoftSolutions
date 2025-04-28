const errorTranslations: Record<string, { en: string; ar: string }> = {
  "This name already exists, change it.": {
    en: "This name already exists, change it.",
    ar: "هذا الاسم موجود بالفعل، الرجاء تغييره.",
  },
  // You can add more error mappings here
};

export function translateErrorMessage(errorMessage: string, locale: string) {
  for (const [key, translations] of Object.entries(errorTranslations)) {
    if (errorMessage.includes(key)) {
      return translations[locale] || errorMessage;
    }
  }
  return errorMessage; // default if no translation found
}
