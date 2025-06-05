'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.sequelize.query("DELETE FROM Categories");
		await queryInterface.sequelize.query("ALTER TABLE Categories AUTO_INCREMENT = 1");

		await queryInterface.bulkInsert('Categories', [
			{
				name: 'Merchandising',
				parent_category: null,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'Coleccionables',
				parent_category: null,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);

		await queryInterface.bulkInsert('Categories', [
			{
				name: 'Decoración',
				parent_category: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'Ropa',
				parent_category: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'Funkos',
				parent_category: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'Armas y réplicas',
				parent_category: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Categories', null, {});
	}
};
