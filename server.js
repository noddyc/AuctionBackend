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
const notificationRouter = require('./routes/notificationRouter')

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
app.use('/notifications', notificationRouter)
app.get('/', (req, res) =>{
    res.send("hello");
})

const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors:{origin:"*"}})
let onlineUsers = new Map();


// const addNewUser = (userId, socketId) => {
//   !onlineUsers.some((user) => user.userId === userId) &&
//     onlineUsers.push({ userId, socketId });
// };


const addNewUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId)
};


const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.get(userId) || null;
  // return onlineUsers.find((user) => user.userId=== userId);
};

io.on('connection', (socket)=>{{
  console.log("User connected");


  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    console.log("I am bere")
    console.log(onlineUsers);
  });

  socket.on("increaseCount", ({receiverId})=>{
    const receiver = getUser(receiverId);
    if(receiver !== null){
      io.to(receiver).emit(
        "increaseNotifyCount", "hello"
      )
    }
  } )


  socket.on("disconnect", ()=>{
    removeUser(socket.id)
    console.log("User disconnected")
  })
}})

server.listen(9001, ()=>{
    console.log("running on port 9001")
})
