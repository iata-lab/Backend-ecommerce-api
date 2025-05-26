const { Product } = require("../models/index");

const ProductController = {
	getAll: (req,res) => {

	},
	getById: (req,res) => {

	},
	create: (req,res) => {
		Product.create(req.body).then(product => {
			res.status(201).send({
				message: "Product created successfully",
				product
			})
		});
	},
	updateById: (req,res) => {

	},
	deleteById: (req,res) => {

	}
};

module.exports = ProductController;
