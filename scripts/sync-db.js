require("dotenv").config();
const { sequelize } = require("../src/config/db.config");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida.");

    const force = process.env.NODE_ENV !== "production";
    await sequelize.sync({ force });

    console.log(
      force
        ? "🧨 Tablas recreadas (modo desarrollo)"
        : "✅ Tablas sincronizadas (modo producción)"
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Error al sincronizar base de datos:", err.message);
    process.exit(1);
  }
}

syncDatabase();
