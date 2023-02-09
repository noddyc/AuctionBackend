module.exports = (sequelize, DataTypes)=>{
    const user_auction = sequelize.define("UserAuction",{
    },
    {timestamps:false})
    return user_auction
}