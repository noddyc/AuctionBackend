const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");
const utils = require('../utils')

const addProduct= async (req, res)=>{

    let obj = {
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
    }
    try{
        const insertion = await db.product.create(obj)
        res.status(200).json(insertion);
    }catch(err){
        res.status(500).json(err.message);
    }
}

module.exports={
    addProduct
}