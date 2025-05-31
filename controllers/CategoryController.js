const { Product, Category, Sequelize: {Op} } = require("../models/index");

module.exports = {
	getCategoriesAndProducts: (req,res) => {
		const { name } = req.query;

		const nameFilter = {
			...(name ? {[Op.like]:name}:{})
		}

		Category.findAll({
			attributes: {
				exclude: ['createdAt','updatedAt']
			},
			include: [
				{ model: Product, through: { attributes: [] }, attributes: { exclude: ['createdAt','updatedAt'] }}
			],
			where: {
				...(name ? {name: nameFilter}:{})
			}
		}).then(categories => {
			res.status(200).send(categories);
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	getCategoryById: (req,res) => {
		let id = +req.params.id;
		if(isNaN(id))
			return res.status(400).send({message:"Bad Request: id must be numeric."});
		Category.findByPk(id, {
			attributes: {
				exclude: ['createdAt','updatedAt']
			}
		}).then(category => {
			if(category) res.status(200).send(category);
			else res.status(404).send({message: "Category Not Found"});
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	createCategory: (req,res) => {
		const { name, parent_category } = req.body;
		if(!name)
			return res.status(400).send({message: 'Category name cannot be null'});
		Category.create(req.body).then(category => {
			res.status(201).send({
				message: "Category created successfully",
				category
			})
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	updateCategory: (req,res) => {
		let id = +req.params.id;
		if(isNaN(id))
			return res.status(400).send({message: "Bad Request: id must be numeric."});
		Category.update(req.body, { where: { id }})
		.then(result => {
			if(result[0] > 0) res.status(200).send({message: "OK"});
			else res.status(404).send({message: "Category Not Found"});
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	deleteCategory: (req,res) => {
		let id = +req.params.id;
		if(isNaN(id))
			return res.status(400).send({message:"Bad Request: id must be numeric."});
		Category.destroy({
			where: { id }
		}).then(result => {
			if(result > 0) res.status(200).send({message:"OK"});
			else res.status(404).send({message:"Category Not Found"});
		}).catch(error => {
			res.status(500).send({message:"Internal Server Error", error});
		})
	}
};
