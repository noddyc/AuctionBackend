/*
    database configuration
*/
module.exports={
    HOST:'multigame.cq1wjzrczlio.us-east-1.rds.amazonaws.com',
    USER: 'admin',
    PASSWORD: '2446592ny',
    DB: 'multigame',
    dialect: 'mysql',

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}