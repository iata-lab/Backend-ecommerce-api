# Backend-ecommerce-api

Backend de una tienda online desarrollado con **Node.js**, **Express**, y **Sequelize**. Esta API gestiona productos, categorías y usuarios, permitiendo operaciones típicas de una tienda online.

---

## 🚀 Tecnologías

- Node.js
- Express
- Sequelize
- MySQL

---

## ⚙️ Instalación y configuración

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/iata-lab/Backend-ecommerce-api.git
   cd Backend-ecommerce-api
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   npm install sequelize-cli -g
   ```

3. **Configura la base de datos:**

   Asegúrate de tener MySQL corriendo y edita `config/config.js` con tus credenciales.

4. **Crea la base de datos:**

   ```bash
   sequelize db:create
   ```

5. **Ejecuta las migraciones:**

   ```bash
   sequelize db:migrate
   ```

6. **Ejecuta los seeders (datos de prueba):**

   ```bash
   sequelize db:seed:all
   ```

---

## Endpoints disponibles

### Productos

- `GET /products?price=&minPrice=&maxPrice=&name=`  
  Lista todos los productos y sus categorías filtrando por precio y nombre.

- `GET /products/:id`  
  Obtiene los detalles de un producto específico y sus categorías.

- `POST /products`  
  Crea un nuevo producto.

- `PUT /products/:id`  
  Actualiza un producto existente.

- `DELETE /products/:id`  
  Elimina un producto.

---

### Categorías

- `GET /categories`  
  Lista todas las categorías y los productos que pertenecen a éstas.

- `GET /categories/:id`  
  Lista los detalles de una categoría.

- `POST /categories`  
  Crea una nueva categoría.

- `PUT /categories/:id`  
  Actualiza una categoría.

- `DELETE /categories/:id`  
  Elimina una categoría.

---

## Autores

- [@ame3310](https://github.com/ame3310)
- [@MrCamoga](https://github.com/MrCamoga)
