/*
    this is the schema of the image table
*/
module.exports = (sequelize, DataTypes)=>{
    const image = sequelize.define("Image",{
        imgData:{
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
    },
    {timestamps:false})
    return image
}