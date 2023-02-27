module.exports = (sequelize, DataTypes)=>{
    const image = sequelize.define("Image",{
        data:{
            type: DataTypes.BLOB,
            allowNull: false
        },
    },
    {timestamps:false})
    return image
}