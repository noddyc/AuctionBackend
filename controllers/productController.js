const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");
const utils = require('../utils')

const addProduct= async (req, res)=>{
    let arr = ['image_1', 'image_2', 'image_3', 'image_4'];
    let obj = {
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
    }
    const files = req.files;
    files.forEach((f, index)=>{
        obj[arr[index]] = f;
    })
    console.log(obj);
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