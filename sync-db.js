const db = require("./models");

if (process.env.NODE_ENV !== 'production') {
db.sequelize
  .sync({ force: true }) //force: true borra datos
  .then(() => {
    console.log("Tablas creadas/existentes");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error: ", err);
    process.exit(1);
  });
} else {
    db.sequelize.sync() // Crea tablas solo si no existen
  .then(() => console.log("✅ Tablas verificadas"))
  .catch(console.error);
}
//node sync-db.js
