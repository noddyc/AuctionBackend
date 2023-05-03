/*
    this is the schema of game table
*/
module.exports = (sequelize, DataTypes)=>{
    const auction = sequelize.define("Auction",{
        start_time:{
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time:{
            type: DataTypes.DATE,
            allowNull: false
        },
        restart:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status:{
            type: DataTypes.ENUM("OPEN_NOT_LIVE", "OPEN_LIVE", "WAITING_FOR_DRAW", "NO_WINNER_WINNER_NOTIFIED")
        },
        multiGame:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {timestamps:false})
    return auction
}