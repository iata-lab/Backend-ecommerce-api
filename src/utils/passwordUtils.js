const bcrypt = require("bcryptjs");
const { PasswordValidationError } = require("../errors");

module.exports = {
  validatePasswordStrength(password) {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!strongRegex.test(password)) {
      throw new PasswordValidationError(
        "La contraseña debe contener: " +
          "8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"
      );
    }
  },

  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
};
