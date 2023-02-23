const notificationController = require('../controllers/notificationController.js')
const notificationRouter = require('express').Router()

notificationRouter.post('/displayNotifications', notificationController.displayNotifications)
notificationRouter.post('/updateNotifications', notificationController.updateNotifications)
notificationRouter.post('/confirmNotifications', notificationController.replyNotifications)
module.exports = notificationRouter