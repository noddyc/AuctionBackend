/*
    database quries of displaying games
 */

const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");

/*
    this is the database query of displaying game information
 */
const displayAuction1 = async(req, res)=>{
    const ownerId = req.body.ownerId;
    try{
        const result = await db.auction.findAll({
            include:[
                {
                    model: db.user,
                    attributes: ['firstname', 'lastname', 'username']
                },
                {
                    model: db.product,
                    through: db.product_auction,
                }
                ]
            ,
            where:{
                ownerId:{
                    [Op.eq]: ownerId
                }
            }
        })
        res.status(200).json(result)
           
    }catch(err){
        res.status(500).send(err.message)
    }
}

module.exports = {displayAuction1}