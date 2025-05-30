const {Order, OrderProduct, User, Products, sequelize} = require("../config/dependencies");
const { NotFoundError } = require("../errors");

exports.getAll() =async (req, res, next)=>{
   try {
      if(!User.isAdmin()){
      throw new NotFoundError();
      }
      next();
      const orders= await Order.findAll()
      res.json(orders)
   } catch (error) 
   {
      next(error)  ;
   }
}

exports.getAnyOrderById() = async (req, res, next)=>{   
   try {
      if(!User.isAdmin()){
         throw new NotFoundError(); //porque un user normal no debería saber que existe el endPoint
      }
      const order= await Order.findByPk(req.params.id)

      if(!order){
          throw new NotFoundError();
      }
      res.json(order)
      next()
   } catch (error) {
     next(error) 
   }
  
}

exports.getAllUserOrders() =async (req, res, next)=>{
   try {

      const orders= await Order.findAll({where: {userId: req.User.id}})
      
      res.json(orders)
      next();
   } catch (error) 
   {
      next(error)  ;
   }
}

exports.getAnyOrderById() = async (req, res, next)=>{   
   try {
      const order= await Order.findByPk(req.params.id,
          {include: [
            {model: OrderProduct, attributes: ["id","price", "quantity"]},
            {model: Product, attributes:["id","name"/*esperar más params */]}]})

      if(!order){
          throw new NotFoundError();
      }
      if(order.userId != req.User.id){
         throw new NotFoundError(); //porque un user normal no debería saber que existe el endPoint
      }

      res.json(order)
      next()
   } catch (error) {
     next(error) 
   }
  
}


