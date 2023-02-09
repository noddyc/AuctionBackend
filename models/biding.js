module.exports = (sequelize, DataTypes)=>{
    const biding = sequelize.define("Biding",{
        slot_number:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {timestamps:false})
    return biding
}