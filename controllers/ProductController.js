const { Product, Sequelize } = require("../models/index");
const { Op } = Sequelize;

const ProductController = {
	getAll: (req,res) => {
		let {sort = 'ASC', name, price, minPrice, maxPrice} = req.query;
		console.log(req.query)
		if(
			(sort != 'ASC' && sort != 'DESC') ||
			(price !== undefined && isNaN(+price)) ||
			(minPrice !== undefined && isNaN(+minPrice)) ||
			(maxPrice !== undefined && isNaN(+maxPrice))
		)
			return res.status(400).send({message:'Bad Request'});
		const priceFilter = {
			...(minPrice !== undefined && minPrice !== '' ? {[Op.gte]: +minPrice }:{}),
			...(maxPrice !== undefined && maxPrice !== '' ? {[Op.lte]: +maxPrice }:{}),
			...(price    !== undefined && price    !== '' ? {[Op.eq]:  +price }:{})
		}
		const nameFilter = {
			...(name ? {[Op.like]:`%${name}%`}:{})
		}

		Product.findAll({
			attributes: {
				exclude: ['createdAt','updatedAt']
			},
			where: {
				...(price || minPrice || maxPrice ? {price: priceFilter}:{}),
				...(name ? {name: nameFilter}:{})
			},
			order: [
				['price',sort]
			]
		}).then(products => {
			res.status(200).send(products);
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},
	getById: (req,res) => {
		let id = +req.params.id;
		if(isNaN(id))
			return res.status(400).send({message:"Bad Request: id must be numeric."});
		Product.findByPk(id).then(product => {
			if(product) res.status(200).send(product);
			else res.status(404).send({messsage: "Product Not Found"});
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	create: (req,res) => {
		const { name, description, price } = req.body;
		if(!name || !description || price == null || isNaN(+price))
			return res.status(400).send({message: 'Bad Request'});
		Product.create(req.body).then(product => {
			res.status(201).send({
				message: "Product created successfully",
				product
			})
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	updateById: (req,res) => {
		let id = +req.params.id;
		if(isNaN(id))
			return res.status(400).send({message: "Bad Request: id must be numeric."});
		Product.update(req.body, { where: { id }})
		.then(result => {
			if(result[0] > 0) res.status(200).send({message: "OK"});
			else res.status(404).send({message: "Product Not Found"});
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	deleteById: (req,res) => {
		let id = +req.params.id;
		if(isNaN(id))
			return res.status(400).send({message:"Bad Request: id must be numeric."});
		Product.destroy({
			where: { id }
		}).then(result => {
			if(result[0] > 0) res.status(200).send({message:"OK"});
			else res.status(404).send({message:"Product Not Found"});
		}).catch(error => {
			res.status(500).send({message:"Internal Server Error", error});
		})
	}
};

module.exports = ProductController;
