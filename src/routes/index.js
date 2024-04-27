const express = require('express');
const router = express.Router();
const routerUser =  require('./user.router')
const routerCategory = require('./category.router')
const routerProduct = require('./product.router')
const routerCart = require('./cart.router')
const { verifyJwt } = require('../utils/verifyJWT')
const routerPurchase = require('./purchase.router')

// colocar las rutas aquí

router.use('/users', routerUser)
router.use('/categories', routerCategory)
router.use('/products', routerProduct)
router.use('/cart', verifyJwt, routerCart)
router.use('/purchase', verifyJwt, routerPurchase)
module.exports = router;
