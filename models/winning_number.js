module.exports = (sequelize, DataTypes)=>{
    const winning_number = sequelize.define("Winning_Number",{
        firstNumber:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        secondNumber:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thirdNumber:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        specialNumber:{
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