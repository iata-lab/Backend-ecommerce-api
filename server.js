require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
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

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.send("Archivo cargado exitosamente.");
});

app.post("/uploads", upload.array("files", 10), (req, res) => {
  // Los archivos cargados estarán disponibles en req.files
  console.log(req.files);
  res.send("Archivos cargados exitosamente.");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost: ${port}`);
});
