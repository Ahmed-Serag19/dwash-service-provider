import i18n from "../i18n";

const customErrorMessages = {
  en: {
    "user not found": "User not found",
    "incorrect password": "Incorrect password",
  },
  ar: {
    "user not found": "هذا المستخدم غير موجود.",
    "incorrect password": "كلمة مرور غير صحيحة",
  },
} as const;

export const normalizeErrorMessage = (
  messageEn: string,
  messageAr: string
): string => {
  const language = i18n.language as keyof typeof customErrorMessages;

  if (language === "en" || language === "ar") {
    const normalizedKey = messageEn
      .trim()
      .toLowerCase() as keyof (typeof customErrorMessages)["en"];
    const customMessage = customErrorMessages[language][normalizedKey];
    if (customMessage) {
      return customMessage;
    }
  }

  return language === "ar"
    ? messageAr || messageEn
    : messageEn.charAt(0).toUpperCase() + messageEn.slice(1);
};
