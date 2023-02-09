module.exports = (sequelize, DataTypes)=>{
    const notification = sequelize.define("Notification",{
        type:{
            type: DataTypes.ENUM("COMPLETED", "CANCELED", "CLOSED"),
            allowNull:false
        },
        message:{
            type: DataTypes.STRING,
            defaultValue: ""
        },
    },
    {timestamps:false})
    return notification
}