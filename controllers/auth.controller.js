const { user, secret, expiresIn, jwt } = require("../config/dependencies");

//JWT token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      userName: user.userName,
      role: user.role,
      session: true,
    },
    secret,
    { expiresIn }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      tokenType: "refresh",
    },
    secret,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Registro de usuario
exports.signUp = async (req, res) => {
  try {
    const { userName, password } = req.body;
    // Añadir validaciones necesarias (seguramente antes de llegar aquí,
    //al menos una entre username y mail tiene que tener valor no nullo o "")
    // Crear usuario (el hash se hace en el modelo)

    const user = await user.create({ userName, password });
    const { accessToken, refreshToken } = generateTokens(user);

    // Guardar refresh token en la base de datos
    await user.update({ refreshToken, lastLogin: new Date() });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        name: user.userName,
        email: user.email,
        role: user.role,
      },
      token: accessToken,
      refreshToken, // Prod: HTTP-only cookie
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "El nombre ya está registrado" });
    }
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { credential, password } = req.body;
    // Validaciónes campos rellenos (seguramente antes de llegar aquí)
    // Buscar usuario
    const user = await user
      .scope({
        method: ["byCredential", credential],
      })
      .findOne();
    if (!user) {
      //poner para cargar mensajes por idioma, de momento a pelitou
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Comparar contraseñas
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar JWT
    const { accessToken, refreshToken } = generateTokens(user);
    await user.update({
      refreshToken,
      lastLogin: new Date(),
    });
    res.json({
      message: "Autenticación exitosa",
      user: {
        id: user.id,
        name: user.userName,
        email: user.email,
        role: user.role,
      },
      token: accessToken,
      refreshToken, // Prod: HTTP-only cookie
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    await user.update({ refreshToken: null }, { where: { id: userId } });

    res.json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Verificar token
    const decoded = jwt.verify(refreshToken, secret);

    if (decoded.tokenType !== "refresh") {
      return res.status(403).json({ error: "Token inválido" });
    }

    // Verificar en base de datos
    const user = await user.findOne({
      where: {
        id: decoded.userId,
        refreshToken,
      },
    });

    if (!user) {
      return res.status(403).json({ error: "Sesión inválida" });
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        userName: user.userName,
        role: user.role,
        session: true,
      },
      secret,
      { expiresIn }
    );

    res.json({
      token: newAccessToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Sesión expirada" });
    }
    console.error("Error en refreshToken:", error);
    res.status(403).json({ error: "Token inválido" });
  }
};
