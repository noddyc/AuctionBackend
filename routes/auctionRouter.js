/*
    this is the router of game section
*/
const auctionController = require('../controllers/auctionController.js')
const auctionWinNum = require('../controllers/auctionWinNum')
const displayAuction = require('../controllers/displayAuction')
const displayAuction1 = require('../controllers/displayAuction1')
const auctionRouter = require('express').Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


auctionRouter.put('/addAuction', auctionController.addAuction)
auctionRouter.post('/joinAuction', auctionController.joinAuction)
auctionRouter.post('/cancelAuction', auctionController.cancelAuction)
auctionRouter.post('/displayAuction', displayAuction.displayAuction)
auctionRouter.post('/createAuction', auctionController.createAuction)
auctionRouter.post('/joinAuction1', auctionController.joinAuction1)
auctionRouter.post('/rollOver', auctionController.rollOver)
auctionRouter.post('/addHost', auctionController.addHost)
auctionRouter.post('/getImage', auctionController.getImage)
auctionRouter.get('/test', auctionController.test)
auctionRouter.post('/updateAuctionStatus', auctionController.updateAuctionStatus)
auctionRouter.post('/displayAuction1', displayAuction1.displayAuction1)
auctionRouter.post('/auctionWinNumber', auctionWinNum.auctionWinNumber)

module.exports = auctionRouter