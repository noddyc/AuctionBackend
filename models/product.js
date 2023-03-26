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
    },
    {timestamps:false})
    return product
}