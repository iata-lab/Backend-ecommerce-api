const { createLogger, format, transports } = require("winston");
const { path } = require("../config/dependencies");
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const contextFormat = printf(
  ({ level, message, timestamp, stack, ...metadata }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (metadata.ctx)
      log += `\nContext: ${JSON.stringify(metadata.ctx, null, 2)}`;
    if (stack) log += `\n${stack}`;
    return log;
  }
);

const sensitiveFields = ["password", "token", "apiKey", "authorization"];
const redactFormat = format((info) => {
  if (info.message && typeof info.message === "object") {
    sensitiveFields.forEach((field) => {
      if (info.message[field]) info.message[field] = "**REDACTED**";
    });
  }
  return info;
});

const devLogger = createLogger({
  level: "debug",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.metadata({ fillExcept: ["message", "level", "timestamp", "stack"] }),
    redactFormat(),
    contextFormat
  ),
  transports: [new transports.Console()],
});

const prodLogger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    format.errors({ stack: true }),
    format.metadata(),
    redactFormat(),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

process.on("unhandledRejection", (reason) => {
  const logger = process.env.NODE_ENV === "production" ? prodLogger : devLogger;
  logger.error("Unhandled Rejection:", {
    message: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

process.on("uncaughtException", (error) => {
  const logger = process.env.NODE_ENV === "production" ? prodLogger : devLogger;
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

module.exports = process.env.NODE_ENV === "production" ? prodLogger : devLogger;
