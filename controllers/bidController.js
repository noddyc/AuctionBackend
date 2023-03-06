const {db, sequelize} = require("../models")
const {Op, literal} = require('sequelize')
const moment = require('moment');

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
                        }
                    ]
                    }]
            })
        res.status(200).send(result);
    }catch(err){
        console.log(err.message);
    }
}

const withdrawBid1 = async (req, res)=>{
    // first confirm status
    // 多少种状况
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
            
            //情况一，不split
            if(matchSlot.dataValues?.split == 'false'){
                // return res.status(200).send("this is not split");
                const slotDeletion = await db.slot.destroy({
                    where: {id: slotId}
                })

                // remove bid
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
                // remove userauction if applicable
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
                return res.status(200).send("Successfully delete");
            }else{
                console.log("here");
                //split, player1
                console.log(matchSlot.dataValues?.player1 == req.body.userId)
                if(matchSlot.dataValues?.player1 == req.body.userId){
                    const slot= await db.slot.update({player1: null}, {
                        where: {id: slotId}
                    })

                    // remove bid
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
                    // remove userauction if applicable
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


                //split, player2
                if(matchSlot.dataValues?.player2 == req.body.userId){
                    const slot= await db.slot.update({player2: null}, {
                        where: {id: slotId}
                    })

                    // remove bid
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
                    // remove userauction if applicable
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
                // check if player 1 and player 2 is null
                const confirmSlot= await db.slot.findOne(
                    {where: {id: slotId}})
                if(confirmSlot.player1 === null && confirmSlot.player2 === null){
                    await db.slot.destroy({
                            where:{
                                id:slotId
                            }
                        })
                }
                return res.status(200).send("Successfully delete");
            }
        })

    }catch(err){
        res.status(500).send({message:err.message});
    }
}


const withdrawBid = async (req, res)=>{
    try{
        const result = await sequelize.transaction(async () =>{
            const conditions = {
                [`slot_${req.body.slot}`]: req.body.userId,
                id:req.body.auctionId,
                status: 'IN_PROGRESS'
            }
            // search for auction
            const matchAuction = await db.auction.findOne({
                where: conditions
            })
            if(!matchAuction?.dataValues){
                throw new Error("Auction not found or auction is not in progress");
            }
            // update auction slot
            console.log(matchAuction.dataValues)
            const updateSlot = await db.auction.update(
                {[`slot_${req.body.slot}`]: null, slotsOpen: matchAuction.dataValues.slotsOpen+1},
                {returning: true, where: conditions}
            )
            // delete bid

            const deleteBid = await db.biding.destroy({
                where:{
                    userId: req.body.userId,
                    auctionId: req.body.auctionId,
                    slot_number: req.body.slot
                    }
                }
            )

            // check user_auction
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