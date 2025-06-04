const { express, logger, morgan } = require("../config/dependencies");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./src/middlewares/");
const i18nMiddleware = require("./src/middlewares/i18n.middleware");
const { NotFoundError, BadRequestError } = require("./src/errors");
const routes = require("./src/app.routes");
const i18nConfig = require("../config/i18n-config");

const app = express();

// ===== 1. Middlewares iniciales =====
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(i18nMiddleware);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: req.__("welcome"),
    currentLanguage: req.getLocale(),
  });
});

// Ruta para cambiar idioma
app.post("/change-language", (req, res, next) => {
  try {
    const { lang } = req.body;

    if (!i18nConfig.locales.includes(lang)) {
      throw new BadRequestError("errors.language.invalid", {
        details: { attempted: lang },
      });
    }

    res.cookie("lang", lang, {
      maxAge: 900000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      success: true,
      message: req.__("language.changed"),
      newLanguage: lang,
    });
  } catch (error) {
    next(error);
  }
});

// Logs HTTP
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// ===== 2. Rutas =====
app.use("/api", routes);

// ===== 3. Manejo de errores =====
app.use((req, res, next) => {
  next(new NotFoundError("errors.http.not_found")); // 404
});

app.use(errorHandler);

module.exports = app;
