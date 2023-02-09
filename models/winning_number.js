module.exports = (sequelize, DataTypes)=>{
    const winning_number = sequelize.define("Winning_Number",{
        number:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        postTime:{
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {timestamps:false})
    return winning_number
}