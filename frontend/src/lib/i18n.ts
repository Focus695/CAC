import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    debug: process.env.NODE_ENV === 'development',
    resources: {
      zh: {
        common: require('../../public/locales/zh/common.json')
      },
      en: {
        common: require('../../public/locales/en/common.json')
      }
    },
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
