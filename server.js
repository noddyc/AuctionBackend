const express = require('express')
const cors = require('cors')
const Server = require('socket.io')
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
app.use(cookieParser())
app.use(
    cors({
      origin: ["http://52.87.235.156:3000", "http://localhost:3000", 'http://3.85.196.187:3000',
      "http://18.234.130.125:9001"],
      credentials: true,
    })
  );

  // "https://heartfelt-moxie-dfa521.netlify.app"

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
