import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your dictionaries
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
    },
    lng: "en", // The default language to load
    fallbackLng: "en", // If a translation is missing in Spanish, use English

    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
  });

export default i18n;
