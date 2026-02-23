import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

// Get device language
const getDeviceLanguage = () => {
  const locales = getLocales();
  if (locales && locales.length > 0) {
    const languageCode = locales[0].languageCode;
    // Return language if we support it, otherwise return 'en'
    return ['en', 'hi', 'mr'].includes(languageCode) ? languageCode : 'en';
  }
  return 'en';
};

// Language resources
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(), // Default to device language
    fallbackLng: 'en', // Fallback to English
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    react: {
      useSuspense: false, // Disable suspense to avoid issues
    },
  });

export default i18n;
