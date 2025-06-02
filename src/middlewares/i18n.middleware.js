const i18n = require("i18n");
const i18nConfig = require("../config/i18n-config");
const {
  getLocaleFromQuery,
  getLocaleFromCookie,
  getLocaleFromHeader,
} = require("../utils/locale-utils");

// 1. Configurar i18n globalmente una sola vez
i18n.configure(i18nConfig);

// 2. Exportar un array de middlewares: [i18n.init, detector personalizado]
module.exports = [
  i18n.init, // Inicializa i18n en cada req
  (req, res, next) => {
    try {
      const queryLang = getLocaleFromQuery(req);
      const cookieLang = getLocaleFromCookie(req);
      const headerLang = getLocaleFromHeader(req);

      const locale =
        queryLang || cookieLang || headerLang || i18nConfig.defaultLocale;

      req.setLocale(locale);

      // Si se pasó ?lang=... en la query, guardar como cookie
      if (queryLang) {
        res.cookie("lang", queryLang, {
          maxAge: 900000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }

      next();
    } catch (error) {
      req.setLocale(i18nConfig.defaultLocale);
      next();
    }
  },
];
