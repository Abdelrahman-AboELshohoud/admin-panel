import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi) // Load translations via HTTP
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Bind i18n to React
  .init({
    fallbackLng: "en", // Default language
    debug: false, // Enable debug in dev
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Translation files path
    },
  });

export default i18n;
