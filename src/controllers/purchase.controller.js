const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product')
const Cart = require('../models/Cart')


const getAll = catchError(async(req, res) => {
    const { id } = req.user
    const purchase = await Purchase.findAll({
      include: [{
        model: Product
      }],
      where: {userId: id}
    });
    return res.json(purchase);
});

const create = catchError(async(req, res) => {
    const cart = await Cart.findAll({
      where: {userId: req.user.id},
      attributes: ['quantity', 'userId', 'productId'],
      raw: true
    })
    const purchase = await Purchase.bulkCreate(cart)
    await Cart.destroy({ where: { userId:req.user.id } })
    return res.json(purchase)
});



module.exports = {
    getAll,
    create
}
