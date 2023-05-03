/*
    this is the schema of slot table
*/
module.exports = (sequelize, DataTypes)=>{
    const slot = sequelize.define("slot",{
        split:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        selfOwn:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
    {timestamps:false})
    return slot
}