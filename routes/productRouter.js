const productController = require('../controllers/productController.js')
const productRouter = require('express').Router()

productRouter.put('/addProduct', productController.addProduct)


module.exports = productRouter