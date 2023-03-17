const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");
const utils = require('../utils')


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}



const test = async(req,res)=>{
    try{
        const result = await db.auction.findAll({
            include:[
                {
                model: db.image,
                as: 'a_Id',
                }
            ]
        })
        res.status(200).send(result)
    }catch(err){
        console.log(err.message)
    }
}


const getImage = async(req,res)=>{
    const auctionId = req.body.auctionId;

    try{
        if(Array.isArray(auctionId)){
            const result = await db.image.findAll({
                where:{
                    auctionId:{
                        [Op.in]: auctionId
                    },
                }
            })
            res.status(200).json(result)
        }else{
            const result = await db.image.findAll({
                where:{
                    auctionId:{
                        [Op.eq]: auctionId
                    },
                }
            })
            res.status(200).json(result)
        }
    }catch(err){
        console.log(err.message)
    }
}

const addAuction= async (req, res)=>{
    console.log(req.body.end_time);
    let obj = {
        ownerId: req.body.ownerId,//
        product_name: req.body.product_name,//
        product_price: req.body.product_price,//
        product_description: req.body.product_description,//
        start_time: req.body.start_time,//
        end_time: req.body.end_time,//
        status: req.body.status || "OPEN_NOT_LIVE",
        winning_number: req.body.winning_number || null, //
        restart: req.body.restart || false,//
    }
    try{
        const insertion = await db.auction.create(obj)
        res.status(200).json(insertion);
    }catch(err){
        res.status(500).json(err.message);
    }
}

const joinAuction= async (req, res)=>{
    try{
        const result = await sequelize.transaction(async () =>{
            let id = req.body.auctionId;
            // search for auction
            const matchAuction = await db.auction.findOne({
                where: {id:id}
            })
            if(matchAuction === null){
                throw new Error("auction not found");
            }
            // check time
            let currentTime = moment(new Date(), req.body.timezone);
            let endTime = moment(matchAuction.dataValues.end_time)
            let endTimeConverted = endTime.subtract(10, 'minutes').tz();
            console.log(endTimeConverted)

            if(currentTime >= endTimeConverted){
                console.log("auction is closed");
                throw new Error("auction is closed")
            }

            // check owner
            if(matchAuction.dataValues.ownerId === req.body.userId){
                console.log("can not join auction created by you");
                throw new Error("can not join auction created by you")
            }

            // check slots
            if(matchAuction.dataValues.slotsOpen === 0){
                console.log("auction is full");
                throw new Error("auction is full");
            }

            // check selected slot is open
            let slotNum = `slot_${req.body.pick}`;
            if(matchAuction.dataValues[slotNum] !== null){
                console.log("selected slot is filled");
                throw new Error("selected slot is filled")
            }
            // add slots to acution
            console.log(matchAuction.dataValues);
            let slotOpen = matchAuction.dataValues.slotsOpen;
            let slotNum1 = `slot_${req.body.pick}`;
            const incrementResult = await db.auction.update(
                {slotsOpen: slotOpen-1, [slotNum1]: req.body.userId},
                {returning: true, where: {id: req.body.auctionId}}
            )
            let newBid = {
                userId: req.body.userId,
                auctionId: req.body.auctionId,
                slot_number: req.body.pick
            }
            // add a relationship to bid record
            const addNewBid = await db.biding.create(newBid);

            // add a relationship to user auction
            const matchUserAuction = await db.user_auction.findOne({
                where: {userId:req.body.userId, auctionId: req.body.auctionId}
            })
            
            if(!matchUserAuction?.dataValues){
                const addUserAuction = await db.user_auction.create(
                    {userId:req.body.userId, auctionId: req.body.auctionId}
                )
            };

            return res.status(200).json(addNewBid);
        })
    }catch(err){
        res.status(500).send({message:err.message});
    }
}

const cancelAuction = async(req, res)=>{
    try{
        const userId = req.body.userId;
        const auctionId = req.body.auctionId;
        const result = await db.auction.update(
            {status: 'CANCELED'},
            {where:{
                [Op.and]:{
                    ownerId:{
                        [Op.eq]: userId
                    },
                    id:{
                        [Op.eq]: auctionId
                    },
                    status:{
                        [Op.or]: ['IN_PROGRESS', 'CLOSED']
                    }
                }
            }}
        )
        res.status(200).json(result);
    }catch(err){
        res.status(500).send("Failed to delete this auction");
    }
}


const createAuction = async(req, res)=>{
    try{
        const result = await db.slotsTable.create();
        const id = result.dataValues.id;
        let obj = {
            ownerId: req.body.ownerId,//
            product_name: req.body.product_name,//
            product_price: req.body.product_price,//
            product_description: req.body.product_description,//
            start_time: req.body.start_time,//
            end_time: req.body.end_time,//
            status: req.body.status,//
            winning_number: req.body.winning_number || null, //
            restart: req.body.restart || false,//

        }
        res.status(200).json(result.dataValues.id);
    }catch(err){
        res.status(500).send("Failed to create auction");
    }
}

function checkSlotsFilled(dataValues){
    const slotArr = ['slot_0','slot_1','slot_2','slot_3','slot_4','slot_5','slot_6','slot_7','slot_8','slot_9'];
    let count = 0;
    for(let i = 0; i < slotArr.length; i++){
        if(dataValues[slotArr[i]] !== null){
            count++;
        }
    }
    return count;
}

const joinAuction1 = async(req, res)=>{
    try{
        const result = await sequelize.transaction(async ()=>{
            // let id = req.body.auctionId;
            const matchAuction = await db.auction.findOne({
                where: {id: req.body.auctionId}
            })
            if(matchAuction === null){
                throw new Error("Game not found");
            }

            // console.log(matchAuction.dataValues)

            let currentTime = moment(new Date(), 'UTC');
            let endTime = moment(matchAuction.dataValues.end_time)
            let endTimeConverted = endTime.subtract(6, 'minutes').tz();
            console.log(endTimeConverted)

            if(currentTime >= endTimeConverted){
                console.log("Game is closed");
                throw new Error("Game is closed")
            }

            // check owner
            if(matchAuction.dataValues.ownerId === req.body.userId){
                console.log("can not join game created by you");
                throw new Error("can not join game created by you")
            }

            // check slots
            // if(matchAuction.dataValues.slotsOpen === 0){
            //     console.log("auction is full");
            //     throw new Error("auction is full");
            // }

            let split = req.body.split;
            let slot = req.body.slot;
            console.log(split);
            // check slot is filled or not
            
            // create slot
            if(split == 'false'){
                console.log('here')
                let obj = {
                    split: false,
                    player1: req.body.userId,
                    player2: null,
                    auctionId: req.body.auctionId
                }

                let newBid = {
                    userId: req.body.userId,
                    auctionId: req.body.auctionId,
                    slot_number: req.body.slot
                }
                
                const insertion = await db.slot.create(obj);
                //update auction
                const update = await db.auction.update(
                    {[`slot_${slot}`]: insertion.id},
                    {where: {id: req.body.auctionId}}
                )

                const addNewBid = await db.biding.create(newBid);

                            // add a relationship to user auction
                const matchUserAuction = await db.user_auction.findOne({
                    where: {userId:req.body.userId, auctionId: req.body.auctionId}
                })
            
                if(!matchUserAuction?.dataValues){
                    const addUserAuction = await db.user_auction.create(
                        {userId:req.body.userId, auctionId: req.body.auctionId}
                    )
                };
            }else{
                if(matchAuction.dataValues[`slot_${slot}`] === null){
                    console.log("line 992")
                    let obj = {
                        split: true,
                        player1: req.body.userId,
                        player2: null,
                        auctionId: req.body.auctionId
                    }

                    let newBid = {
                        userId: req.body.userId,
                        auctionId: req.body.auctionId,
                        slot_number: req.body.slot
                    }

                    const insertion = await db.slot.create(obj);
                    //update auction
                    const update = await db.auction.update(
                        {[`slot_${slot}`]: insertion.id},
                        {where: {id: req.body.auctionId}}
                    )
    
                    const addNewBid = await db.biding.create(newBid);
    
                                // add a relationship to user auction
                    const matchUserAuction = await db.user_auction.findOne({
                        where: {userId:req.body.userId, auctionId: req.body.auctionId}
                    })
                
                    if(!matchUserAuction?.dataValues){
                        const addUserAuction = await db.user_auction.create(
                            {userId:req.body.userId, auctionId: req.body.auctionId}
                        )
                    };   
                }else{
                    // match for the slot 
                    const slotMatch = await db.slot.findOne({
                        where: {id: matchAuction.dataValues[`slot_${slot}`]}
                    })
                    console.log(slotMatch.dataValues)
                    // there is no player2
                    if(slotMatch.dataValues.player2 === null){
                        // console.log("line 1028")
                        // return res.status(200).send("line 1028")
                        const slotId = matchAuction.dataValues[`slot_${slot}`];
                        //update auction
                        const update = await db.slot.update(
                            {[`player2`]: req.body.userId},
                            {where: {id: slotId}}
                        )
                        // if findone not found then returns null;
                        const matchBid = await db.biding.findOne({
                            where: {userId:req.body.userId, auctionId: req.body.auctionId, slot_number: req.body.slot}
                        })
            
                        // console.log("line is 1046")
                        // console.log(matchBid)
                        // console.log(matchBid.dataValues === null || matchBid.dataValues === undefined)
                        if(matchBid===null || matchBid === undefiend){
                            console.log("line 1047")
                            const addBid = await db.biding.create(
                                {   userId: req.body.userId,
                                    auctionId: req.body.auctionId,
                                    slot_number: req.body.slot}
                            )
                        }; 

                        const matchUserAuction = await db.user_auction.findOne({
                            where: {userId:req.body.userId, auctionId: req.body.auctionId}
                        })
                        console.log("line 1061")
                        console.log(matchUserAuction)
                        if(matchUserAuction === null || matchUserAuction === undefined){
                            const addUserAuction = await db.user_auction.create(
                                {userId:req.body.userId, auctionId: req.body.auctionId}
                            )
                        }
                    }else{
                        // const slotId = matchAuction.dataValues[`slot_${slot}`];
                        // //update auction
                        // console.log("line 1060")
                        // return res.status(200).send("line 1060")
                        const slotId = matchAuction.dataValues[`slot_${slot}`];
                        //update auction
                        const update = await db.slot.update(
                            {[`player1`]: req.body.userId},
                            {where: {id: slotId}}
                        )
                        // if findone not found then returns null;
                        const matchBid = await db.biding.findOne({
                            where: {userId:req.body.userId, auctionId: req.body.auctionId, slot_number: req.body.slot}
                        })
            
                        // console.log("line is 1046")
                        // console.log(matchBid)
                        // console.log(matchBid.dataValues === null || matchBid.dataValues === undefined)
                        if(matchBid===null || matchBid === undefiend){
                            console.log("line 1047")
                            const addBid = await db.biding.create(
                                {   userId: req.body.userId,
                                    auctionId: req.body.auctionId,
                                    slot_number: req.body.slot}
                            )
                        }; 

                        const matchUserAuction = await db.user_auction.findOne({
                            where: {userId:req.body.userId, auctionId: req.body.auctionId}
                        })
                        console.log("line 1061")
                        console.log(matchUserAuction)
                        if(matchUserAuction === null || matchUserAuction === undefined){
                            const addUserAuction = await db.user_auction.create(
                                {userId:req.body.userId, auctionId: req.body.auctionId}
                            )
                        }
                    }
                }
            }
            const auctionStatus = await db.auction.findOne({
                where: {id: req.body.auctionId}
            })
            let count = checkSlotsFilled(auctionStatus.dataValues);
            if(count >= 7){
                const update = await db.auction.update(
                    {status: 'OPEN_LIVE'},
                    {where: {id: req.body.auctionId}}
                )
            }else{
                const update = await db.auction.update(
                    {status: 'OPEN_NOT_LIVE'},
                    {where: {id: req.body.auctionId}}
                )
            }
            
            
            return res.status(200).json("Successfully join game");
        })
    }catch(err){
        res.status(500).send("Failed to join game");
    }
}

function findOwnerSpot(dataValues){
    let arr = ['slot0', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7', 'slot8', 'slot9']
    for(let i = 0; i < arr.length; i++){
        if(dataValues[arr[i]] !== null && dataValues[arr[i]].selfOwn == true){
            return dataValues[arr[i]].id;
        }
    }
    return null;

}

const rollOver = async(req, res) =>{
    //check status and winner
    try{
        const result = await sequelize.transaction(async ()=>{
            const matchAuction = await db.auction.findOne({
                include:[
                    {
                        model: db.slot,
                        as: 'slot0',
                      },
                    {
                      model: db.slot,
                      as: 'slot1',
                    },
                    {
                      model: db.slot,
                      as: 'slot2',
                    },
                    {
                        model: db.slot,
                        as: 'slot3',
                    },
                    {
                        model: db.slot,
                        as: 'slot4',
                    },
                    {
                        model: db.slot,
                        as: 'slot5',
                    },
                    {
                        model: db.slot,
                        as: 'slot6',
                    },
                    {
                        model: db.slot,
                        as: 'slot7',
                    },
                    {
                        model: db.slot,
                        as: 'slot8',
                      },
                    {
                        model: db.slot,
                        as: 'slot9',
                    }
                  ]
                ,
                where:{
                    id: req.body.auctionId
                }
            })
            // check status
            if(matchAuction.dataValues.status !== 'NO_WINNER_WINNER_NOTIFIED'){
                throw new Error("Failed to RollOver");
            }
            // check no winner
            const num = await db.winning_number.findOne({
                where: {id: matchAuction.dataValues.winnning_number}
            })
    
            if(matchAuction.dataValues[`slot_${num.dataValues.specialNumber}`] !== null){
                console.log("Failed to RollOver with a winner")
                throw new Error("Failed to RollOver with a winner")
            }
    
            // // find onwer spot
            let ownerSpot = findOwnerSpot(matchAuction.dataValues);
            
           
            // delete owner spot
            if(ownerSpot !== null){
                const deleteSpot = await db.slot.destroy(
                    {where: 
                        {id: ownerSpot}
                    }
                )
            }

            // update status and end time
            let endTime = new Date(matchAuction.dataValues.end_time);
            endTime.setUTCDate(endTime.getUTCDate() + 1);
            // console.log(endTime)

            let updateStatus = await db.auction.update(
                {status: "OPEN_NOT_LIVE", end_time: endTime},
                {where: {
                    id: req.body.auctionId
                }}
            )          

            return res.status(200).json(updateStatus);
        })
    }catch(err){
        res.status(500).send({msg: err.message});
    }
}

function sixSpotTaken(dataValues){
    let arr = ['slot0', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7', 'slot8', 'slot9']
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        if(dataValues[arr[i]] != null){
            count++;
        }
    }
    return count === 6;
}

function firstOpenSpot(dataValues){
    let arr = ['slot_0', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_6', 'slot_7', 'slot_8', 'slot_9']
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        if(dataValues[arr[i]] === null){
            return arr[i];
        }
    }
    return null;
}


const updateAuctionStatus = async(req, res)=>{
    try{
        const result = await sequelize.transaction(async ()=>{
            let currentDate = new Date();
            let sixMinutesLater =  new Date(currentDate.toUTCString());
            sixMinutesLater.setMinutes(sixMinutesLater.getMinutes() + 6);
            console.log(sixMinutesLater)
            //update
            const update = await db.auction.update(
                {status: 'WAITING_FOR_DRAW'},
                {   
                    where: {
                        [Op.and]:{
                            status:{
                                [Op.or]: ['OPEN_NOT_LIVE','OPEN_LIVE']
                            },
                            end_time:{
                                [Op.lte]:sixMinutesLater
                            }
                        }
                    }
                }
            )
            return res.status(200).json(update);
        })
    }catch(err){
        res.status(500).send({msg: err.message});
    }
}

const addHost = async(req, res)=>{
    // is waiting for draw
    // has six spot
    try{
        const result = await sequelize.transaction(async ()=>{
            const matchAuction = await db.auction.findOne({
                include:[
                    {
                        model: db.slot,
                        as: 'slot0',
                      },
                    {
                      model: db.slot,
                      as: 'slot1',
                    },
                    {
                      model: db.slot,
                      as: 'slot2',
                    },
                    {
                        model: db.slot,
                        as: 'slot3',
                    },
                    {
                        model: db.slot,
                        as: 'slot4',
                    },
                    {
                        model: db.slot,
                        as: 'slot5',
                    },
                    {
                        model: db.slot,
                        as: 'slot6',
                    },
                    {
                        model: db.slot,
                        as: 'slot7',
                    },
                    {
                        model: db.slot,
                        as: 'slot8',
                      },
                    {
                        model: db.slot,
                        as: 'slot9',
                    }
                  ]
                ,
                where:{
                    id: req.body.auctionId
                }
            })


            if(matchAuction.dataValues.status !=='WAITING_FOR_DRAW'){
                console.log("1310 here")
                throw new Error("Failed to pick slot as host")
            }
            if(!sixSpotTaken(matchAuction.dataValues)){
                console.log(sixSpotTaken(matchAuction.dataValues));
                console.log("1314 here")
                throw new Error("Failed to pick slot as host")
            }

            // // create slot
            const createSlot = await db.slot.create(

                {   
                    split: false,
                    player1: req.body.userId,
                    player2: null,
                    auctionId: req.body.auctionId,
                    selfOwn: true
                
                }
            )
            // // update slot

            let openSlot = firstOpenSpot(matchAuction.dataValues);
            console.log(openSlot);
            console.log(createSlot.dataValues.id);

            const updateSlot = await db.auction.update(
                {
                    [openSlot]: createSlot.dataValues.id},
                {where: 
                {
                    id: req.body.auctionId
                }}
            )
            return res.status(200).json({slot: updateSlot});
        })
    }catch(err){
        res.status(500).send({msg: err.message});
    }
}


module.exports={
    addAuction, joinAuction, cancelAuction, createAuction, joinAuction1, rollOver, addHost, getImage, test,
    updateAuctionStatus
}