module.exports={
    HOST:'localhost',
    USER: 'root',
    PASSWORD: '2446592ny',
    DB: 'auctionWeb',
    dialect: 'mysql',

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}