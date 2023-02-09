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
            type: DataTypes.ENUM("CLOSED", "IN_PROGRESS", "COMPLETED",
            "CANCELED", "WAITING")
        },
        slotsOpen: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        slot_0:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_1:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_2:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_3:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_4:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_5:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_6:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_7:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_8:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        slot_9:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
    },
    {timestamps:false})
    return auction
}