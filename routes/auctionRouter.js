const auctionController = require('../controllers/auctionController.js')
const auctionRouter = require('express').Router()
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const storage = multer.memoryStorage();
// const upload = multer({storage: storage})

auctionRouter.put('/addAuction', auctionController.addAuction)
auctionRouter.post('/joinAuction', auctionController.joinAuction)
auctionRouter.post('/cancelAuction', auctionController.cancelAuction)
auctionRouter.post('/displayAuction', auctionController.displayAuction)
auctionRouter.post('/createAuction', auctionController.createAuction)
auctionRouter.post('/joinAuction1', auctionController.joinAuction1)
auctionRouter.post('/rollOver', auctionController.rollOver)
auctionRouter.post('/addHost', auctionController.addHost)
auctionRouter.get('/getImage', auctionController.getImage)
// auctionRouter.post('/addImage', auctionController.addImage)
module.exports = auctionRouter