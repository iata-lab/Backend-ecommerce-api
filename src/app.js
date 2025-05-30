// app.js
const { express, logger } = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("../middlewares/errorHandler");
//const routes = require("./routes");

const app = express();

// ===== 1. Middlewares iniciales (se ejecutan en cada request) =====
app.use(cors());
app.use(express.json());

// Logs de solicitudes HTTP
app.use(
  morgan("dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ===== 2. Rutas =====
app.use("/api", routes); // PONER LAS RUTAS





// ===== 3. Middlewares finales (manejo de errores) =====
app.use((req, res, next) => {
  next(new NotFoundError("Ruta no encontrada")); // 404
});

app.use(errorHandler);

module.exports = app;
