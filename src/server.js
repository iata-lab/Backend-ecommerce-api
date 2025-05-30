const app = require("./app");
const { port, logger } = require("../config/dependencies.js");

app.listen(port, () => {
  logger.info(`Servidor escuchando en http://localhost: ${port}`);
});
