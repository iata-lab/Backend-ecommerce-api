'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        ...{'name': 'Espada de Acero Valyrio', 'description': 'Réplica de espada hecha de acero valyrio.', 'price': 250.0},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'name': 'Mapa de Westeros', 'description': 'Mapa detallado de los Siete Reinos.', 'price': 50.0},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'name': 'Camiseta Casa Stark', 'description': 'Camiseta con el emblema de la Casa Stark.', 'price': 20.0},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'name': 'Funko Pop Jon Snow', 'description': 'Figura coleccionable de Jon Snow.', 'price': 15.0},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'name': 'Cuaderno del Cuervo de Tres Ojos', 'description': 'Cuaderno de notas edición especial.', 'price': 12.5},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
