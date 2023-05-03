/*
    this is the schema of the product table
*/

module.exports = (sequelize, DataTypes)=>{
    const product = sequelize.define("Product",{
        product_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        product_price:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        product_description:{
            type: DataTypes.STRING,
            defaultValue: ""
        },
        image_1:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
        image_2:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
        image_3:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
        image_4:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
    },
    {timestamps:false})
    return product
}