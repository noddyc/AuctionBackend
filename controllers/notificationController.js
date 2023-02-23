const {db, sequelize} = require("../models")
const {Op, literal} = require('sequelize')
const moment = require('moment');

const displayNotifications = async (req, res)=>{
    let id = req.body.userId;
    try{
        const result = await db.notification.findAll({
            where:{
                receiverId: id,
                decline: false
            }
            })
        res.status(200).send(result);
    }catch(err){
        console.log(err.message);
    }
}

module.exports={
    displayNotifications
}