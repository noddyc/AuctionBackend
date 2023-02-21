const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
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
        status: req.body.status,//
        winning_number: req.body.winning_number || null, //
        restart: req.body.restart || false,//
        // slotsOpen: req.body.slots || 10,//
        // slot_0: req.body.slot_0 || null,
        // slot_1: req.body.slot_1 || null, 
        // slot_2: req.body.slot_2 || null,
        // slot_3: req.body.slot_3 || null,
        // slot_4: req.body.slot_4 || null,
        // slot_5: req.body.slot_5 || null,
        // slot_6: req.body.slot_6 || null,
        // slot_7: req.body.slot_7 || null,
        // slot_8: req.body.slot_8 || null,
        // slot_9: req.body.slot_9 || null,
    }
    try{
        const insertion = await db.auction.create(obj)
        res.status(200).send(insertion);
    }catch(err){
        res.status(500).send(err.message);
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

const displayAuction = async(req, res)=>{
    // console.log(req.body);
    const statues = req.body.statues;
    const ownerId = req.body.ownerId;
    console.log(statues);
    console.log(ownerId)
    try{
        // find owner id first
        if(ownerId){
            if(Array.isArray(statues)){
                const result = await db.auction.findAll({
                    include:[
                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        }
                      ]
                    ,
                    where:{
                        [Op.and]:{
                            status:{
                                [Op.in]: statues
                            },
                            ownerId:{
                                [Op.eq]: ownerId
                            }
                        }
                    }
                })
                res.status(200).json(result)
            }else{
                const result = await db.auction.findAll({
                    include:[
                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        }
                      ]
                    ,
                    where:{
                        [Op.and]:{
                            status:{
                                [Op.eq]: statues
                            },
                            ownerId:{
                                [Op.eq]: ownerId
                            }
                        }
                    }
                })
                res.status(200).json(result)
            }
        }else{
            // owner id not present
            // console.log(Array.isArray(statues));
            if(Array.isArray(statues)){
                const result = await db.auction.findAll({
                    include: [
                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        }
                      ]
                    ,
                    where:{
                        status: {[Op.in]: statues}
                    }
                })
                res.status(200).json(result)
            }else{
                const result = await db.auction.findAll({
                    include: [
                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                    },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                            ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                            }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        }
                      ]
                    ,
                    where:{
                        status: {[Op.eq]: statues}
                    }
                })
                res.status(200).json(result)
            }
        }
    }catch(err){
        res.status(500).send(err.message)
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
    // let obj = {
    //     ownerId: req.body.ownerId,//
    //     product_name: req.body.product_name,//
    //     product_price: req.body.product_price,//
    //     product_description: req.body.product_description,//
    //     start_time: req.body.start_time,//
    //     end_time: req.body.end_time,//
    //     status: req.body.status,//
    //     winning_number: req.body.winning_number || null, //
    //     restart: req.body.restart || false,//

    // }
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
                throw new Error("auction not found");
            }

            // console.log(matchAuction.dataValues)

            let currentTime = moment(new Date(), 'UTC');
            let endTime = moment(matchAuction.dataValues.end_time)
            let endTimeConverted = endTime.subtract(6, 'minutes').tz();
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
                // split true
                // there is no player1
                  // there is player1
                console.log(matchAuction.dataValues[`slot_${slot}`] )
                if(matchAuction.dataValues[`slot_${slot}`] === null){
            
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
                    const slotId = matchAuction.dataValues[`slot_${slot}`];
                    //update auction
                    const update = await db.slot.update(
                        {[`player2`]: req.body.userId},
                        {where: {id: slotId}}
                    )

                    const matchBid = await db.biding.findOne({
                        where: {userId:req.body.userId, auctionId: req.body.auctionId}
                    })
                
                    if(!matchBid?.dataValues){
                        const addBid = await db.user_auction.create(
                            {   userId: req.body.userId,
                                auctionId: req.body.auctionId,
                                slot_number: req.body.slot}
                        )
                    }; 

                    const matchUserAuction = await db.user_auction.findOne({
                        where: {userId:req.body.userId, auctionId: req.body.auctionId}
                    })
                
                    if(!matchUserAuction?.dataValues){
                        const addUserAuction = await db.user_auction.create(
                            {userId:req.body.userId, auctionId: req.body.auctionId}
                        )
                    };  
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
            
            
            return res.status(200).json();
        })
    }catch(err){
        res.status(500).send("auction joined successfully");
    }
}

const rollOver = async(req, res) =>{
    //check status and winner
    try{
        const result = await db.auction.findOne({
            where: {id: req.body.auctionId}
        })
    }catch(err){

    }
}

const addHost = async(req, res)=>{
    
}

module.exports={
    addAuction, joinAuction, cancelAuction, displayAuction, createAuction, joinAuction1
}