const errorTranslations: Record<string, { en: string; ar: string }> = {
  "This name already exists, change it.": {
    en: "This name already exists, change it.",
    ar: "هذا الاسم موجود بالفعل، الرجاء تغييره.",
  },
  "Patient not found": {
    en: "Patient not found",
    ar: "هذا المريض غير موجود",
  },
  "Phone must start with 0 and be 10-15 digits": {
    en: "Phone must start with 0 and be 10-15 digits",
    ar: "رقم الهاتف يجب أن يبدأ بصفر و يكون من 10 الى 15 خانة",
  },
  "Patient name already exists in this clinic": {
    en: "Patient name already exists in this clinic",
    ar: "هذا الاسم موجود بالفعل، الرجاء تغييره.",
  },
  // You can add more error mappings here
};

export function translateErrorMessage(errorMessage: string, locale: string) {
  for (const [key, translations] of Object.entries(errorTranslations)) {
    if (errorMessage?.includes(key)) {
      return translations[locale] || errorMessage;
    }
  }
  return errorMessage; // default if no translation found
}
