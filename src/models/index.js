const User = require("./User")
const Category = require('./Category')
const Product = require('./Product')
const Cart = require('./Cart')
const Purchase = require('./Purchase')

Product.belongsTo(Category)
Category.hasMany(Product)

Cart.belongsTo(User)
User.hasMany(Cart)

Cart.belongsTo(Product)
Product.hasMany(Cart)

User.hasMany(Purchase)
Purchase.belongsTo(User)

Product.hasMany(Purchase)
Purchase.belongsTo(Product)
