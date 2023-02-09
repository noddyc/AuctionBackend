const userController = require('../controllers/userController.js')
const userRouter = require('express').Router()
const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

userRouter.put('/addUser', userController.addUser)
userRouter.post('/checkDuplicateEmail', userController.checkDuplicateEmail)
userRouter.post('/checkDuplicateUserName', userController.checkDuplicateUserName)
userRouter.post('/loginUser', userController.loginUser)
userRouter.post('/getInfo', userController.getInfo)
userRouter.post('/updateUser', userController.updateUser)
module.exports = userRouter