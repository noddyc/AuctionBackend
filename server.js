const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const {Sequelize, DataTypes} = require('sequelize');
const userRouter = require('./routes/userRouter')
const auctionRouter = require('./routes/auctionRouter');
const winningNumberRouter = require('./routes/winningNumberRouter');
const bidRouter = require('./routes/bidRouter')

const app = express()
app.use(cors());
app.use(bodyParser.json());
// 如果用qs结构，则用extend:true`
app.use(bodyParser.urlencoded({
    extended:true,
}))
app.use(express.json())
// app.use(cookieParser())
app.use(
    cors({
      origin: ["http://localhost:3000","http://localhost:3001", "https://dancing-bienenstitch-6e1606.netlify.app"],
      credentials: true,
    })
  );

app.use('/winningNum', winningNumberRouter)
app.use('/auction', auctionRouter)
app.use('/user', userRouter)
app.use('/bid', bidRouter)
app.get('/', (req, res) =>{
    res.send("hello");
})

app.listen(9001, ()=>{
    console.log("running on port 9001")
})
