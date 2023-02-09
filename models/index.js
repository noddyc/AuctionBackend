const dbConfig = require('../config/dbConfig.js')
const {Sequelize, DataTypes, VIRTUAL} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool:{
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate().then(
    () => console.log('Database connected...')
).catch(
    (err) => console.log(err.message)
)

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.user = require('./user')(sequelize, DataTypes)
db.auction = require('./auction')(sequelize, DataTypes)
db.user_auction = require('./user_auction')(sequelize, DataTypes)
db.notification = require('./notification')(sequelize, DataTypes)
db.biding = require('./biding')(sequelize, DataTypes)
db.winning_number = require('./winning_number')(sequelize, DataTypes)


db.user.belongsToMany(db.auction, {as:'userId', through: db.user_auction, foreignKey: 'userId'})
db.auction.belongsToMany(db.user, {as: 'auctionId', through: db.user_auction, foreignKey: 'auctionId'})

db.auction.belongsTo(db.user, {foreignKey: 'ownerId',  onDelete: 'cascade' })
db.auction.belongsTo(db.winning_number, {foreignKey: 'winnning_number', onDelete: 'cascade'})

db.notification.belongsTo(db.user, {foreignKey: 'userId', onDelete: 'cascade' })

db.biding.belongsTo(db.user, {foreignKey: 'userId',  onDelete: 'cascade' })
db.biding.belongsTo(db.auction, {foreignKey: 'auctionId',  onDelete: 'cascade' })

// generate()

db.sequelize.sync({force: false}).then(()=>console.log("DB Sync completed"))

module.exports = {db, sequelize};


function generate(){
    let firstname = "Harry"
    let lastname = "Potter"
    let password = "2446592Ny!"
    let imagepath = ""
    let arr = []
    for(let i = 0; i <= 20; i++){
        let email = "a" + i + "@rit.edu"
        let username = "a"+i
        arr.push({email: email, username: username, firstname: firstname,
        lastname: lastname, password: password, imagepath : imagepath})
    }
    db.user.bulkCreate(arr).then(()=>{console.log("bulk user records created")})
}
