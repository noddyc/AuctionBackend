/*
    this is the router of the notification section 
*/

const notificationController = require('../controllers/notificationController.js')
const notificationRouter = require('express').Router()

notificationRouter.post('/displayNotifications', notificationController.displayNotifications)
notificationRouter.post('/updateNotifications', notificationController.updateNotifications)
notificationRouter.post('/confirmNotifications', notificationController.replyNotifications)
notificationRouter.post('/createNotifications', notificationController.createNotifications)
notificationRouter.post('/deleteNotifications', notificationController.deleteNotifications)
notificationRouter.post('/searchNotifications', notificationController.searchNotifications)
notificationRouter.post('/updateNotificationsView', notificationController.updateNotificationsView)
module.exports = notificationRouter