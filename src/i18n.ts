import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend, { HttpBackendOptions } from "i18next-http-backend";
import { traduoraOptions } from "./i18n.traduora";

let backendOptions = {};

if (import.meta.env.VITE_TRANSLATION_TRADUORA === "true") {
  backendOptions = traduoraOptions;
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    supportedLngs: ["en", "pl"],
    lng: "pl",
    fallbackLng: "en",
    backend: backendOptions,
    debug: true,
    interpolation: { escapeValue: false }
  });

export default i18n;
