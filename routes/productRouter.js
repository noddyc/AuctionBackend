const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const productController = require('../controllers/productController.js')
const productRouter = require('express').Router()

//upload.fields([
// { name: 'files1', maxCount: 10 },
// { name: 'files2', maxCount: 10 },])
productRouter.post('/addProduct', upload.array('image'), productController.addProduct)


module.exports = productRouter