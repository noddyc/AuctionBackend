const winningNumController = require('../controllers/winningNumController')
const winningNumberRouter = require('express').Router()

winningNumberRouter.post('/addWinningNumber', winningNumController.addWinningNumber)
module.exports = winningNumberRouter