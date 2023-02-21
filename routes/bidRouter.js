const bidController = require('../controllers/bidController.js')
const bidRouter = require('express').Router()

bidRouter.post('/displayBid', bidController.displayBid)
bidRouter.post('/withdrawBid', bidController.withdrawBid)
bidRouter.post('/withdrawBid1', bidController.withdrawBid1)
module.exports = bidRouter