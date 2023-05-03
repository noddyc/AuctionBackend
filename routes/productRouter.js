/*
    this is the router of the product section
*/

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const productController = require('../controllers/productController.js')
const productRouter = require('express').Router()

productRouter.post('/addProduct', upload.array('image'), productController.addProduct)


module.exports = productRouter