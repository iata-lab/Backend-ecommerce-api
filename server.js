require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 3000;

const { sequelize } = require("./src/config/db.config");

sequelize
  .authenticate()
  .then(() => {
    console.log("🟢 Conexión establecida con Sequelize.");
    return sequelize.sync(); // O sync({ force: true }) si necesitas forzar tablas (⚠️ borra datos).
  })
  .then(() => {
    console.log("🟢 Modelos sincronizados correctamente.");
  })
  .catch((err) => {
    console.error("🔴 Error al conectar con Sequelize:", err);
  });
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost: ${port}`);
});
