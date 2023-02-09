const {db, sequelize} = require("../models")
const {Op} = require('sequelize')
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

module.exports={
    displayBid
}