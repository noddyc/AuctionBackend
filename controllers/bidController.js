/*
    database quries of bids
 */
const {db, sequelize} = require("../models")
const {Op, literal} = require('sequelize')
const moment = require('moment');
const _ = require('lodash')

/*
    this is the function to check if the slot is the 6th slot
*/
const checkSlotIsSix = (dataValues)=>{
    const arr = ['slot_0', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_6', 'slot_7', 'slot_8','slot_9','slot_10'];
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        if(!_.isNil(dataValues[arr[i]])){
            console.log(dataValues[arr[i]])
            count++;
        }
    }
    return count <= 6
}

/*
    this is the database query of displaying game bids
*/
const displayBid = async (req, res)=>{
    let id = req.body.userId;
    try{
        const result = await db.biding.findAll({
            where:{
                userId: id,
            }, 
            include: [{
                    model:db.auction,
                    required:true,
                    include:[
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        },
                        {
                            model: db.winning_number,
                            as: 'winNum',
                            attributes:['firstNumber','secondNumber','thirdNumber','specialNumber'],
                            required: false
                        },
                        {
                            model: db.product,
                            through: db.product_auction,
                        }
                    ]
                    }]
            })
        res.status(200).send(result);
    }catch(err){
        console.log(err.message);
    }
}

/*
    this is the database query of withdraw game bids
*/
const withdrawBid1 = async (req, res)=>{
    try{
        const result = await sequelize.transaction(async () =>{
        
            let slot = req.body.slot;
            const matchAuction = await db.auction.findOne({
                where: {id: req.body.auctionId}
            })

            if(matchAuction.dataValues.status !== 'OPEN_LIVE'
            && matchAuction.dataValues.status !== 'OPEN_NOT_LIVE'){
                throw new Error("This game can not withdraw")
            }
            let slotId =  matchAuction.dataValues[`slot_${slot}`]

            if(slotId === null){
                throw new Error("This slot is empty")
            }

            const matchSlot = await db.slot.findOne({
                where: {id: slotId}
            })
            
            if(matchSlot.dataValues?.split == 'false'){
                const slotDeletion = await db.slot.destroy({
                    where: {id: slotId}
                })

                const matchBid = await db.biding.findOne({
                    where:{userId: req.body.userId, 
                    auctionId: req.body.auctionId,
                    slot_number: req.body.slot}
                })
                if(matchBid){
                    await db.biding.destroy(
                        {where: {id: matchBid.dataValues.id}}
                    )
                }
                const matchUserAuction = await db.biding.findAll({
                    where:{
                        userId: req.body.userId, 
                        auctionId: req.body.auctionId,
                    }
                })
                if(matchAuction.length === 1){
                    await db.user_auction.destroy({
                        where:{
                            userId: req.body.userId,
                            auctionId: req.body.auctionId
                        }
                    })
                }

                const checkAuctionIsSix = await db.auction.findOne({
                    where: {id: req.body.auctionId}
                }).then(async (e)=>{
                    if(checkSlotIsSix(e.dataValues)){
                        await db.auction.update(
                            {status: 'OPEN_NOT_LIVE'},
                            {where:{
                                id: req.body.auctionId
                            }}
                        )
                    }
                })
                return res.status(200).send("Successfully delete");
            }else{
                if(matchSlot.dataValues?.player1 == req.body.userId){
                    const slot= await db.slot.update({player1: null}, {
                        where: {id: slotId}
                    })
                    const matchBid = await db.biding.findOne({
                        where:{userId: req.body.userId, 
                        auctionId: req.body.auctionId,
                        slot_number: req.body.slot}
                    })
                    if(matchBid){
                        await db.biding.destroy(
                            {where: {id: matchBid.dataValues.id}}
                        )
                    }
                    const matchUserAuction = await db.biding.findAll({
                        where:{
                            userId: req.body.userId, 
                            auctionId: req.body.auctionId,
                        }
                    })
                    if(matchAuction.length === 1){
                        await db.user_auction.destroy({
                            where:{
                                userId: req.body.userId,
                                auctionId: req.body.auctionId
                            }
                        })
                    }
                }

                if(matchSlot.dataValues?.player2 == req.body.userId){
                    const slot= await db.slot.update({player2: null}, {
                        where: {id: slotId}
                    })

                    const matchBid = await db.biding.findOne({
                        where:{userId: req.body.userId, 
                        auctionId: req.body.auctionId,
                        slot_number: req.body.slot}
                    })
                    if(matchBid){
                        await db.biding.destroy(
                            {where: {id: matchBid.dataValues.id}}
                        )
                    }

                    const matchUserAuction = await db.biding.findAll({
                        where:{
                            userId: req.body.userId, 
                            auctionId: req.body.auctionId,
                        }
                    })
                    if(matchAuction.length === 1){
                        await db.user_auction.destroy({
                            where:{
                                userId: req.body.userId,
                                auctionId: req.body.auctionId
                            }
                        })
                    }
                }

                const confirmSlot= await db.slot.findOne(
                    {where: {id: slotId}})
                if(confirmSlot.player1 === null && confirmSlot.player2 === null){
                    await db.slot.destroy({
                            where:{
                                id:slotId
                            }
                        })
                }


                const checkAuctionIsSix = await db.auction.findOne({
                    where: {id: req.body.auctionId}
                }).then(async (e)=>{

                    if(checkSlotIsSix(e.dataValues)){
                        await db.auction.update(
                            {status: 'OPEN_NOT_LIVE'},
                            {where:{
                                id: req.body.auctionId
                            }}
                        )
                    }
                })

                return res.status(200).send("Successfully delete");
            }
        })

    }catch(err){
        res.status(500).send({message:err.message});
    }
}


/*
    this is the database query of withdraw game bids
*/
const withdrawBid = async (req, res)=>{
    try{
        const result = await sequelize.transaction(async () =>{
            const conditions = {
                [`slot_${req.body.slot}`]: req.body.userId,
                id:req.body.auctionId,
                status: 'IN_PROGRESS'
            }
            const matchAuction = await db.auction.findOne({
                where: conditions
            })
            if(!matchAuction?.dataValues){
                throw new Error("Auction not found or auction is not in progress");
            }        
            const updateSlot = await db.auction.update(
                {[`slot_${req.body.slot}`]: null, slotsOpen: matchAuction.dataValues.slotsOpen+1},
                {returning: true, where: conditions}
            )
            const deleteBid = await db.biding.destroy({
                where:{
                    userId: req.body.userId,
                    auctionId: req.body.auctionId,
                    slot_number: req.body.slot
                    }
                }
            )
            const bids = await db.biding.findAll({
                where: {userId: req.body.userId, auctionId: req.body.auctionId}
            })

            if(bids.length===0){
                const deleteUserAuction = await db.user_auction.destroy({
                    where: {userId: req.body.userId, auctionId: req.body.auctionId}
                    }
                )
            }
            return res.status(200).json(bids.length===0);
        })
    }catch(err){
        res.status(500).send({message:err.message});
    }
}



module.exports={
    displayBid, withdrawBid, withdrawBid1
}