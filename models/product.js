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
        image1:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
        image2:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
        image3:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
        image4:{
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        },
    },
    {timestamps:false})
    return product
}