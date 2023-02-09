module.exports={
    HOST:'database-2.cgmtzjvr1ab2.us-east-1.rds.amazonaws.com',
    USER: 'admin',
    PASSWORD: '2446592ny',
    DB: 'initial_db',
    dialect: 'mysql',

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}