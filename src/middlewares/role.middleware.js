const { authorize } = require("./auth.middleware");

exports.requireAdmin = authorize("admin"); //De auth middleware, moverlo aquí? Mirar
