const notificationController = require('../controllers/notificationController.js')
const notificationRouter = require('express').Router()

notificationRouter.post('/displayNotifications', notificationController.displayNotifications)
module.exports = notificationRouter