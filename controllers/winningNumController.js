const {db, sequelize} = require("../models")
const {Op} = require('sequelize')
const moment = require('moment');

const addWinningNumber = async (req, res)=>{
    try{
        let obj = {
            number: req.body.number,
            postTime: req.body.postTime,
            firstNum: false,
        }
        const result = await sequelize.transaction(async()=>{
                const insertion = await db.winning_number.create(obj);
                let id = insertion.id;
                const assign = await db.auction.update(
                    {winnning_number: id},
                    {returning: true, where: {
                        [Op.and]:{
                            end_time:{
                                [Op.lte]: moment(obj.postTime)
                            },
                            status: 'WAITING'
                        }
                    }});
                return res.status(200).send(assign);
            }
        )
    }catch(err){
        console.log(err.message);
    }
}

module.exports={
    addWinningNumber
}