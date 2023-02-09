module.exports = (sequelize, DataTypes)=>{
    const user = sequelize.define("User",{
        email:{
            type: DataTypes.STRING,
            allowNull:false
        },
        username:{
            type: DataTypes.STRING,
            allowNull:false
        },
        password:{
            type: DataTypes.STRING,
            allowNull:false
        },
        firstname:{
            type: DataTypes.STRING,
            allowNull:false
        },
        lastname:{
            type: DataTypes.STRING,
            allowNull:false
        },
        admin:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        address:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        timezone:{
            type: DataTypes.STRING,
            defaultValue: "UTC",
            allowNull: false
        }
    },
    {timestamps:false})
    return user
}