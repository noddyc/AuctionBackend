const {db, sequelize} = require("../models")
const {Op, literal} = require('sequelize')
const moment = require('moment');

const displayNotifications = async (req, res)=>{
    let id = req.body.userId;
    try{
        const result = await db.notification.findAll({
            where:{
                receiverId: id,
                response :"NONE"
            }
            })
        res.status(200).json(result);
    }catch(err){
        console.log(err.message);
    }
}

const updateNotificationsView = async (req, res)=>{
    try{
        let id = req.body.id;
        const result = await db.notification.update(
            {
                viewed: false
            },
            {
                where:{
                    id: id
                }
            }
        )
        res.status(200).json(result);
    }catch(err){
        console.log(err.message)
    }
}

const searchNotifications = async (req, res)=>{
    try{
        const {message, response, viewed, auctionId, senderId, receiverId} = req.body;
        let where = {};
        if(message){
            where.message = {[Op.eq]: message}
        }
        if(response){
            where.response = {[Op.eq]: response}
        }
        if(viewed){
            where.viewed = {[Op.eq]: viewed}
        }
        if(auctionId){
            where.auctionId = {[Op.eq]: auctionId}
        }
        if(senderId){
            where.senderId = {[Op.eq]: senderId}
        }
        if(receiverId){
            where.receiverId = {[Op.eq]: receiverId}
        }
        const search = await db.notification.findAll(
            {
                where
            }
        )
        res.status(200).json(search)
    }catch(err){
        console.log(err.message)
    }
}

const createNotifications = async (req, res) =>{
    try{
        let senderId = req.body.senderId
        let receiverId = req.body.receiverId
        let slot = req.body.slot
        let auctionId = req.body.auctionId

        let obj = {
            type: "RETRACTION_SEND", 
            message: `player ${senderId} request retraction on slot ${slot} of auction with id ${auctionId}`,
            auctionId: auctionId,
            senderId: senderId,
            receiverId: receiverId,
            response: "NONE",
            viewed: false
        }
        const result = await db.notification.create(obj);
        res.status(200).json(result);
    }catch(err){
        console.log(err.message);
    }

}

const replyNotifications = async (req, res)=>{
    // implement in transaction

    try{
        const result = await sequelize.transaction(async () =>{
                //update
                const result = await db.notification.update(
                    {response: req.body.response==="ACCEPT"?"ACCEPT":"DECLINE" },
                    {
                        where:{
                            id: req.body.id
                        }
                    }
                )
                // find match
                const matchNote = await db.notification.findOne(
                    {
                        where: {
                            id: req.body.id
                        }
                    }
                )

                // create confirm back msg to sender
                let senderId = matchNote.dataValues.senderId;
                let receiverId = matchNote.dataValues.receiverId;
                let obj = req.body.response==="ACCEPT"?
                {
                    type:"RETRACTION_RECEIVE", message: `${receiverId} confirm your retraction request`, auctionId: 4, senderId: receiverId, receiverId: senderId, response: "NONE", viewed: false
                }:
                {
                    type:"RETRACTION_RECEIVE", message: `${receiverId} decline your retraction request`, auctionId: 4, senderId: receiverId, receiverId: senderId, response: "NONE", viewed: false
                }
                const sendBackMsg = await db.notification.create(obj);

                return res.status(200).json(sendBackMsg);
            })
        }
        catch(err){
            console.log(err.message);
        }
}

const updateNotifications = async (req, res) =>{
    let list = req.body.list;
    console.log(Array.isArray(list));
    try{
        if(Array.isArray(list)){
            const result = await db.notification.update({
                viewed: true
                }
                ,
                {where:{
                    receiverId:{
                        [Op.in]: list
                    },
                }
            })
            return res.status(200).send(result);
        }else{
            const result = await db.notification.update({
                viewed: true
                }
                ,
                {where:{
                    receiverId:{
                        [Op.eq]: list
                    },
                }
            })
            return res.status(200).json(result);
        }
    }catch(err){
        res.status(500).send(err.message);
    }
}

const deleteNotifications = async (req, res)=>{
    let id = req.body.id;
    try{
        const result = await db.notification.destroy(
            {where: {
                id: id
            }
            }
        )
        return res.status(200).json(result)
    }catch(err){
        res.status(500).send(err.message)
    }

}



module.exports={
    displayNotifications, updateNotifications, replyNotifications, createNotifications, deleteNotifications, searchNotifications, updateNotificationsView
}