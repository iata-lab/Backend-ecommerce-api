const bcrypt = require("bcryptjs");

const plainPassword = "StrongPass123";
const hashFromDB =
  "$2b$10$b2wuBJmCk.1eqqlToHYjy.baMCAhPrIsWQZqT3F1bKehID37HbJo2";

const isMatch = bcrypt.compareSync(plainPassword, hashFromDB);
console.log("¿Coincide la contraseña?:", isMatch);
