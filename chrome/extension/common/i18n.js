import appMessages from './appMessages.json';

const language = (navigator.languages && navigator.languages[0])
  || navigator.language
  || navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages = appMessages[languageWithoutRegionCode] || appMessages[language] || appMessages.en;

export { messages, language };
