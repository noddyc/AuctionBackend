const {db, sequelize} = require("../models")
const {Op, literal} = require('sequelize')
const moment = require('moment');

const displayBid = async (req, res)=>{
    let id = req.body.userId;
    try{
        const result = await db.biding.findAll({
            where:{
                userId: id,
            }, include: [{
                    model:db.auction,
                    required:true,
                    // include:[
                    //     {
                    //         model: db.winning_number,
                    //         required: true,
                    //         attributes:[
                    //             'postTime','number'
                    //         ]
                    //     }]
                            }]
                        })
        res.status(200).send(result);
    }catch(err){
        console.log(err.message);
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
    displayBid, withdrawBid
}