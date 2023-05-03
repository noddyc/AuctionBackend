/*
    database quries of winning numbers
 */
const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");

/*
    this is the database query of fetching winning number
*/
const auctionWinNumber = async(req, res)=>{
    const statues = req.body.statues;
    const ownerId = req.body.ownerId;
    try{
        if(ownerId){
            if(Array.isArray(statues)){
                const result = await db.auction.findAll({
                    attributes:['id'],
                    include:[
                        {
                            model: db.winning_number,
                            as: 'winNum',
                            attributes: ['firstNumber','secondNumber','thirdNumber','specialNumber'],
                            required: true
                        },
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
                    attributes:['id'],
                    include:[
                        {
                            model: db.winning_number,
                            as: 'winNum',
                            attributes: ['firstNumber','secondNumber','thirdNumber','specialNumber'],
                            required: true
                        },
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
            if(Array.isArray(statues)){
                const result = await db.auction.findAll({
                    attributes:['id'],
                    include: [
                        {
                            model: db.winning_number,
                            as: 'winNum',
                            attributes: ['firstNumber','secondNumber','thirdNumber','specialNumber'],
                            required: true
                        },
                      ]
                    ,
                    where:{
                        status: {[Op.in]: statues}
                    }
                })
                res.status(200).json(result)
            }else{
                const result = await db.auction.findAll({
                    attributes:['id'],
                    include: [
                        {
                            model: db.winning_number,
                            as: 'winNum',
                            attributes:['firstNumber','secondNumber','thirdNumber','specialNumber'],
                            required: true
                        },
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

module.exports = {auctionWinNumber}