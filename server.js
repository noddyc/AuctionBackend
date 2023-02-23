const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {sequelize, db} = require("./models")

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


// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };

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

  // increase count in
  // first do it in db,
  // then emit the event to client
  socket.on("increaseCount", async ({receiverId, response, id})=>{
    const receiver = getUser(receiverId);
    console.log(receiverId)
    let obj = {
      type:"RETRACTION_SEND", message:"Hello", auctionId: 4, senderId: 5, receiverId: receiverId, response: "NONE", viewed: false
    }
    try{
          //update
      const result = await db.notification.update(
          {response: response==="ACCEPT"?"ACCEPT":"DECLINE" },
          {
              where:{
                  id: id
              }
          }
      )
      // find match
      const matchNote = await db.notification.findOne(
        {
            where: {
                id: id
            }
        }
      )

      // create confirm back msg to sender
      let noteSenderId = matchNote.dataValues.senderId;
      let noteReceiverId = matchNote.dataValues.receiverId;
      let obj = response==="ACCEPT"?
      {
          type:"RETRACTION_RECEIVE", message: `${receiverId} confirm your retraction request`, auctionId: 4, senderId: noteReceiverId, receiverId: noteSenderId, response: "NONE", viewed: false
      }:
      {
          type:"RETRACTION_RECEIVE", message: `${receiverId} decline your retraction request`, auctionId: 4, senderId: noteReceiverId, receiverId: noteSenderId, response: "NONE", viewed: false
      }
      const sendBackMsg = await db.notification.create(obj);
      if(receiver !== null){
        console.log("I am bere2")
        console.log(onlineUsers)
        io.to(receiver).emit(
          "increaseNotifyCount", obj
        )
      }
    }catch(err){
      console.log(err.message)
    }
  } )


  // socket.on("disconnect", ()=>{
  //   removeUser(socket.id)
  //   console.log("User disconnected")
  // })
}})

server.listen(9001, ()=>{
    console.log("running on port 9001")
})
