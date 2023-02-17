module.exports = (sequelize, DataTypes)=>{
    const slot = sequelize.define("slot",{
        // id:{
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true 
        // },
        // auctionId:{
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        // },
        split:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
    {timestamps:false})
    return slot
}