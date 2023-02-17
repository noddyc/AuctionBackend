const dbConfig = require('../config/dbConfig.js')
const {Sequelize, DataTypes, VIRTUAL} = require('sequelize');
const moment = require('moment')

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
db.slot = require('./slot')(sequelize, DataTypes)

db.user.belongsToMany(db.auction, {as:'userId', through: db.user_auction, foreignKey: 'userId'})
db.auction.belongsToMany(db.user, {as: 'auctionId', through: db.user_auction, foreignKey: 'auctionId'})

db.auction.belongsTo(db.user, {foreignKey: 'ownerId',  onDelete: 'cascade' })
db.auction.belongsTo(db.winning_number, {foreignKey: 'winnning_number', onDelete: 'cascade'})

db.notification.belongsTo(db.user, {foreignKey: 'userId', onDelete: 'cascade' })

db.biding.belongsTo(db.user, {foreignKey: 'userId',  onDelete: 'cascade' })
db.biding.belongsTo(db.auction, {foreignKey: 'auctionId',  onDelete: 'cascade' })

db.slot.belongsTo(db.user,{foreignKey: 'player1', onDelete: 'cascade'})
db.slot.belongsTo(db.user,{foreignKey: 'player2', onDelete: 'cascade'})
db.slot.belongsTo(db.auction, { foreignKey: 'auctionId', onDelete: 'cascade'})

db.auction.belongsTo(db.slot, {foreignKey: 'slot_0', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_1', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_2', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_3', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_4', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_5', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_6', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_7', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_8', onDelete: 'cascade'})
db.auction.belongsTo(db.slot, {foreignKey: 'slot_9', onDelete: 'cascade'})

db.notification.belongsTo(db.auction, {foreignKey: 'auctionId', onDelete: 'cascade' })
db.notification.belongsTo(db.user, {foreignKey:'userId', onDelete: 'cascade'})
// generate()

//
db.sequelize.sync({force: false}).then(()=>console.log("DB Sync completed"))

module.exports = {db, sequelize};


function generate(){

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let firstname = "Harry"
    let lastname = "Potter"
    let password = "2446592Ny!"
    let imagepath = ""
    let address = "1 Lomb Memorial Dr, Rochester, NY 14623"
    let arr = []
    for(let i = 0; i <= 25; i++){
        let email = "a" + i + "@rit.edu"
        let username = "a"+i
        arr.push({email: email, username: username, firstname: firstname,
        lastname: lastname, password: password, imagepath : imagepath, address:address})
    }
    db.user.bulkCreate(arr).then(()=>{console.log("bulk user records created")})


    let year = '2023'
    let month = '01'
    let winningArr = [];
    for(let i=0; i <= 20; i++){
        let curDate = year+'-'+month+'-'+getRandomInt(1,25)+' '+getRandomInt(1,20)+':'+getRandomInt(1,50)+':00'
        winningArr.push({number: getRandomInt(0,9), postTime: curDate})
    }

    db.winning_number.bulkCreate(winningArr).then(()=>{console.log("bulk winning number created")})



    let auctionArr= [];
    let product_name_arr = ["Lion", "Tiger", "Elephant", "Giraffe", "Cheetah", "Leopard", "Zebra", "Hippopotamus", "Rhinoceros", "Gorilla"];
    const product_description_arr = [
        "Lions are big cats, apex predators.",
        "Elephants are intelligent, large land animals.",
        "Giraffes are tall mammals with long necks.",
        "Hippos are semi-aquatic, aggressive animals.",
        "Pandas are black and white bear species."
      ];
    let product_price = "210.01"
    let start_time = moment.tz("2022-01-08T08:00:00","YYYY-MM-DDTHH:mm:ss", 'UTC').format();
    let end_time = moment.tz("2022-01-08T13:00:00", "YYYY-MM-DDTHH:mm:ss", 'UTC').format();
    let status_arr = ["CLOSED", "IN_PROGRESS", "COMPLETED",
    "CANCELED", "WAITING"]
    let price_arr = ['212.02', '2132.12', '65.90', '434.12', '769.03']
    
    // moment(year+'-'+getRandomInt(2,9)+'-'+getRandomInt(1,25)+' '+getRandomInt(1,20)+':'+getRandomInt(1,50)+':00', 'UTC').format()
    for(let i = 0; i < 500; i++){
        auctionArr.push({ownerId: getRandomInt(1,20), product_name: product_name_arr[getRandomInt(0,8)], 
            product_description: product_description_arr[getRandomInt(0,4)],
            product_price: price_arr[getRandomInt(0,4)], status: status_arr[getRandomInt(0,4)],
            start_time: start_time, end_time: end_time
         })
    }
    db.auction.bulkCreate(auctionArr).then(()=>{console.log("bulk auctions created")})
}
