/*
    database queries of winning number
*/

const {db, sequelize} = require("../models")
const {Op} = require('sequelize')
const moment = require('moment');

/*
    this is the database query of adding winning number
*/
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

/*
    this is the database query of submitting winning number
*/

const submitWinningNumber = async (req, res)=>{
    try{
        let obj = {
            firstNumber: req.body.firstNumber,
            secondNumber: req.body.secondNumber,
            thirdNumber: req.body.thirdNumber,
            specialNumber: req.body.specialNumber,
            postTime: new Date()
        }
        const targetDateTime = new Date(); 

        const result = await sequelize.transaction(async()=>{
            const insertion = await db.winning_number.create(obj);
            
            const updates = await db.auction.update(
                    {winnning_number: insertion.id,
                    status: "NO_WINNER_WINNER_NOTIFIED"}, 
                    {where:{
                        [Op.and]:{
                            end_time:{
                                [Op.lt]: targetDateTime
                            },
                            status:{
                                [Op.ne]: "NO_WINNER_WINNER_NOTIFIED"
                            }
                        }
                    }}
            )
            return res.status(200).json(updates)
        }
        )
    }catch(err){
        console.log(err.message)
    }

}

module.exports={
    addWinningNumber, submitWinningNumber
}