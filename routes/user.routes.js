const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
// POST /api/auth/signup
//Hablar si ponerlo en rutas distintas o en la misma


//Movido a auth.routes, mirar si hacen falta cambios
/*router.post("/signup", authController.signUp);
router.post("/login", authController.signIn);*/

//Datos de cada usuario
router.get('/profile', authenticate, user.controller.getProfile);





module.exports = router;
