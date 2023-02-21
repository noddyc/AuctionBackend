const auctionController = require('../controllers/auctionController.js')
const auctionRouter = require('express').Router()

auctionRouter.put('/addAuction', auctionController.addAuction)
auctionRouter.post('/joinAuction', auctionController.joinAuction)
auctionRouter.post('/cancelAuction', auctionController.cancelAuction)
auctionRouter.post('/displayAuction', auctionController.displayAuction)
auctionRouter.post('/createAuction', auctionController.createAuction)
auctionRouter.post('/joinAuction1', auctionController.joinAuction1)
module.exports = auctionRouter