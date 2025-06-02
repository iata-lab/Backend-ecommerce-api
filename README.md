Probar tests:
Cree un usuario temporal con POST /api/auth/signup.

Haga login con ese usuario para obtener un token.

Use ese token en las peticiones protegidas (como PATCH /api/profile).


npm test

Backend de E-commerce desarrollado usando Node.js con Express, autenticación con JWT, validaciones con Joi, e internacionalización (i18n) en español, inglés y euskera.

Tecnologías usadas:

Node.js + Express — Servidor y routing
Sequelize + MySQL — ORM y persistencia
JWT (access & refresh) — Autenticación segura
Joi — Validaciones robustas con soporte i18n
i18n — Soporte multilenguaje (es, en, eu)
Manejo centralizado de errores — AppError con soporte multilingüe
Multer (opcional) — Para subida de archivos
dotenv — Configuración por entorno

Instalación:

git clone ponerRepo
cd backend-ecommerce-api
npm install

Seguridad:

JWT (access y refresh)
Contraseñas hasheadas con bcrypt
Verificación por rol (admin opcional)
Confirmación de contraseña para eliminar cuenta
Validaciones robustas en todos los inputs

probar conexion (opcional): 
node src/sync-db.js

Crear BBDD si no existe:
npx sequelize-cli db:create

Inicializar tablas:
npm sequelize-cli init

Migracion tablas:
npx sequelize-cli db:migrate

Usar los seeds!:
npx sequelize-cli db:seed:all

npm run dev/node src/server.js



