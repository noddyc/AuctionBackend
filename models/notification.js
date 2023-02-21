module.exports = (sequelize, DataTypes)=>{
    const notification = sequelize.define("Notification",{
        type:{
            type: DataTypes.ENUM("NUMBER_DECLARED", "GAME_ALIVE", "GAME_NOT_ALIVE",
            "GAME_ROLLOVER", "GAME_NO_WINNER", "GAME_OPEN"),
            allowNull:false
        },
        message:{
            type: DataTypes.STRING,
            dßefaultValue: ""
        },
    },
    {timestamps:false})
    return notification
}