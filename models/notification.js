module.exports = (sequelize, DataTypes)=>{
    const notification = sequelize.define("Notification",{
        type:{
            type: DataTypes.ENUM("RETRACTION_SEND", "RETRACTION_RECEIVE"),
            allowNull:false
        },
        message:{
            type: DataTypes.STRING,
            defaultValue: ""
        },
        handled:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        viewed:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {timestamps:false})
    return notification
}