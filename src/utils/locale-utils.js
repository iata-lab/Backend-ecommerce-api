const i18nConfig = require("../config/i18n-config");

module.exports = {
  getLocaleFromQuery: (req) => {
    if (req.query.lang && i18nConfig.locales.includes(req.query.lang)) {
      return req.query.lang;
    }
    return null;
  },

  getLocaleFromCookie: (req) => {
    if (req.cookies.lang && i18nConfig.locales.includes(req.cookies.lang)) {
      return req.cookies.lang;
    }
    return null;
  },

  getLocaleFromHeader: (req) => {
    const acceptLanguage = req.headers["accept-language"];
    if (!acceptLanguage) return null;

    const languages = acceptLanguage.split(",");
    for (const lang of languages) {
      const locale = lang.split(";")[0].trim().substring(0, 2);
      if (i18nConfig.locales.includes(locale)) {
        return locale;
      }
    }

    return null;
  },
};
