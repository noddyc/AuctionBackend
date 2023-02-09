const {db} = require("../models")
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const {Op} = require('sequelize')


const addUser = async (req, res)=>{
    let obj = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }
    try{
        const insertion = await db.user.create(obj)
        res.status(200).json(insertion)
    }catch(err){
        console.log(err.message);
    }
}

const checkDuplicateUserName = async (req, res) =>{
    const username = req.body.username
    try{
        const users = await db.user.findAll({
            where: {username}
        })
        if(users.length > 0){
            res.status(200).send(false)
        }else{
            res.status(200).send(true)
        }
    }catch(err){
        console.log(err.message)
        res.send("username it failed")
    }
}

const checkDuplicateEmail = async (req, res) =>{
    const email = req.body.email
    try{
        const emails = await db.user.findAll({
            where: {email}
        })
        if(emails.length > 0){
            res.status(200).send(false)
        }else{
            res.status(200).send(true)
        }
    }catch(err){
        console.log(err.message)
    }
}

const loginUser = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    try{
        const matchUser = await db.user.findOne({
            where: {email}
        })
        if(matchUser == null){
            // console.log("1");
            res.status(500).json({message: "User doesn't exist"});
        }else{
            if(matchUser.dataValues.password === password){
                // req.session.email = matchUser.dataValues.email;
                // console.log("2");
                // console.log(req.session)
                const jwtToken = jwt.sign(
                    { id: matchUser.dataValues.id },
                    'secret'
                  );
                res.status(200).json({id: matchUser.dataValues.id, message: "Log in successful", token: jwtToken})
            }else{
                // console.log("3");
                res.status(500).json({message: "Wrong username/password"})
            }
        }
    }catch(err){
        // console.log("4")
        res.send(err.message)
    }
}



const getInfo = async (req, res)=>{
    let whereClause = {};
    if(req.body.email){
        whereClause['email']=req.body.email 
    }
    if(req.body.id){
        whereClause['id']=req.body.id 
    }
    console.log(whereClause);
    try{
        const matchUser = await db.user.findOne({
            where: {
                [Op.and]:[
                    whereClause
                ]
            }
        })
        if(matchUser == null){
            console.log("1");
            res.status(500).json({message: "User doesn't exist"});
        }else{
            res.status(200).json(matchUser);
        }
    }catch(err){
        console.log("4")
        res.status(500).send(err.message)
    }
}


const updateUser = async (req, res) =>{
    try{
        let updateConditions = {id: req.body.id};
        let obj = {};
        if(req.body.username !== ""){
            obj = {...obj, username: req.body.username};
        }
        if(req.body.email !== ""){
            obj = {...obj, email: req.body.email};
        }
        if(req.body.firstname !== ""){
            obj = {...obj, firstname: req.body.firstname};
        }
        if(req.body.lastname !== ""){
            obj = {...obj, lastname: req.body.lastname};
        }
        if(req.body.address !==  ""){
            obj = {...obj, address: req.body.address};
        }
        if(req.body.timezone !== ""){
            obj = {...obj, timezone: req.body.timezone}
        }
        console.log(obj)
        const result = await db.user.update(obj, {where: updateConditions})
        console.log(result)
        res.status(200).json(result)
    }catch(err){
        res.status(500).send(err.message)
    }
}

module.exports={
    addUser, checkDuplicateUserName, checkDuplicateEmail, loginUser,
    getInfo, updateUser
}