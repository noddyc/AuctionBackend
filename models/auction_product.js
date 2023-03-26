module.exports = (sequelize, DataTypes)=>{
    const product_auction = sequelize.define("ProductAuction",{
    },
    {timestamps:false})
    return product_auction
}