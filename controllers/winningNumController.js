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

const submitWinningNumber = async (req, res)=>{
    try{
        let obj = {
            firstNumber: req.body.firstNumber,
            secondNumber: req.body.secondNumber,
            thirdNumber: req.body.thirdNumber,
            specialNumber: req.body.specialNumber,
            postTime: new Date()
        }
        const targetDateTime = new Date(); // Replace with your target date and time
        // const targetDate = new Date(targetDateTime.getFullYear(), targetDateTime.getMonth(), targetDateTime.getDate());
        // const targetTime = targetDateTime.getTime();

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