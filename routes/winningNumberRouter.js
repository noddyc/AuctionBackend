const winningNumController = require('../controllers/winningNumController')
const winningNumberRouter = require('express').Router()

winningNumberRouter.post('/addWinningNumber', winningNumController.addWinningNumber)
winningNumberRouter.post('/submitWinningNumber', winningNumController.submitWinningNumber)
module.exports = winningNumberRouter