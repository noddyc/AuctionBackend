module.exports = (sequelize, DataTypes)=>{
    const notification = sequelize.define("Notification",{
        type:{
            type: DataTypes.ENUM("RETRACTION_SEND", "RETRACTION_RECEIVE"),
            allowNull: false,
        },
        message:{
            type: DataTypes.STRING,
            defaultValue: ""
        },
        response:{
            type: DataTypes.ENUM("ACCEPT", "DECLINE", "NONE"),
            defaultValue: "NONE"
        },
        viewed:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        }
    },
    {timestamps:false})
    return notification
}