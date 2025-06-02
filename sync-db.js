const db = require("./models");

const syncDatabase = async () => {
  try {
    const force = process.env.NODE_ENV !== "production";
    await db.sequelize.sync({ force });
    console.log(
      force ? " Tablas recreadas (modo desarrollo)" : "✅ Tablas verificadas"
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al sincronizar la base de datos:", err.message);
    process.exit(1);
  }
};

syncDatabase();
