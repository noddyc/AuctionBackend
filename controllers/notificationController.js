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
        res.status(200).send(result);
    }catch(err){
        console.log(err.message);
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
        res.status(200).send(result);
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

                return res.status(200).send(sendBackMsg);
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
                    id:{
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
                    id:{
                        [Op.eq]: list
                    },
                }
            })
            return res.status(200).send(result);
        }
    }catch(err){
        res.status(500).send(err.message);
    }
}



module.exports={
    displayNotifications, updateNotifications, replyNotifications,createNotifications
}