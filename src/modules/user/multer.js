const multer = require("multer");
const path = require("path");

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Definir el directorio de destino
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Definir el nombre del archivo
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Crear una instancia de Multer con la configuración de almacenamiento
const upload = multer({ storage: storage });
