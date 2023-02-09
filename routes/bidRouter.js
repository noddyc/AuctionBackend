const bidController = require('../controllers/bidController.js')
const bidRouter = require('express').Router()

bidRouter.post('/displayBid', bidController.displayBid)
module.exports = bidRouter