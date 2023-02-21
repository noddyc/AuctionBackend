module.exports = (sequelize, DataTypes)=>{
    const auction = sequelize.define("Auction",{
        product_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        product_price:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        product_description:{
            type: DataTypes.STRING,
            defaultValue: ""
        },
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
            // type: DataTypes.ENUM("CLOSED", "IN_PROGRESS", "COMPLETED", "WAITING")
            type: DataTypes.ENUM("OPEN_NOT_LIVE", "OPEN_LIVE", "WAITING_FOR_DRAW", "NO_WINNER_WINNER_NOTIFIED")
        },
    },
    {timestamps:false})
    return auction
}