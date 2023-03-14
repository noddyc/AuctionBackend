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
const axios = require('axios')
const qs = require('qs')
const multer = require('multer')
const _ = require('lodash')
const cron = require('node-cron')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const ip = 'http://localhost:9001'
const ip = 'http://54.224.203.213:9001'

cron.schedule('40 35 12 * * *', async ()=>{
  let config = {
    method: 'post',
    url: `${ip}/auction/updateAuctionStatus`,
    headers: { },
    data : data
  };
  
  axios(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
})

cron.schedule('40 17 21 * * *', async ()=>{
  let config = {
    method: 'post',
    url: `${ip}/auction/updateAuctionStatus`,
    headers: { },
    data : data
  };
  
  axios(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
})

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
      origin: ["http://54.224.203.213:3000", "http://localhost:3000", 'http://3.85.196.187:3000',
      "http://18.234.130.125:9001"],
      credentials: true,
    })
  );


app.use('/winningNum', winningNumberRouter)
app.use('/auction', auctionRouter)
app.use('/user', userRouter)
app.use('/bid', bidRouter)
app.use('/notifications', notificationRouter)

app.post('/api/posts', upload.array('image'), async (req, res) => {
  const file = req.files
  const id = req.body.auctionId[0]
  const buffers = file.map((f)=>{
    return {imgData: f.buffer, auctionId: id}
  })
  try{
    const result = await db.image.bulkCreate(buffers);
    res.status(200).send(result);
  }catch(err){
    console.log(err.message);
  }
})


app.get('/', (req, res) =>{
    res.send("hello");
})


const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors:{origin:"*"}})
let onlineUsers = new Map();


const addNewUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId)
};


const getUser = (userId) => {
  return onlineUsers.get(userId) || null;
};

io.on('connection', (socket)=>{{
  // console.log("User connected");


  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    // console.log("I am bere")
    // console.log(onlineUsers);
  });

  socket.on("createNotification", async({name, auctionId, slot, senderId, receiverId})=>{
    const receiver = getUser(receiverId);
    let obj = {
      type: "RETRACTION_SEND", message: `Player ${_.startCase(name)} (id: ${senderId}) request retraction of Game (id: ${auctionId}) on Slot ${slot}`,
      auctionId: auctionId, senderId: senderId, receiverId: receiverId, 
    }
    try{
      const result = await db.notification.create(obj);
      if(receiver !== null){
        io.to(receiver).emit(
          "increaseNotifyCount", result.dataValues
        )
      }
    }catch(err){
      console.log(err.messagr)
    }
  })
  // increase count in
  // first do it in db,
  // then emit the event to client
  
  socket.on("increaseCount", async ({receiverId, response, id, slot, auctionId, name})=>{
    // console.log(receiverId+ " "+response+" "+id+" " + slot)
    // console.log("I am here in increase count")
    const receiver = getUser(receiverId);
    // console.log(receiverId)
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

      if(response === "ACCEPT"){
              // delete bid
        let data = qs.stringify({
        'auctionId': auctionId,
        'userId': receiverId,
        'slot': slot,
        });
  
        let config = {
          method: 'post',
          url: `${ip}/bid/withdrawBid1`,
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : data
        };
        axios(config).then((response) => {
          // console.log("able to delete")
          // console.log(JSON.stringify(response.data));
        }).catch((error) => {
          throw new Error("Failed to delete selection")
        })

      }

      // console.log(matchNote.dataValues)
      // create confirm back msg to sender
      let noteSenderId = matchNote.dataValues.senderId;
      let noteReceiverId = matchNote.dataValues.receiverId;
      let obj = response==="ACCEPT"?
      {
          type:"RETRACTION_RECEIVE", message: `Host ${_.startCase(name)} (id: ${receiverId}) confirm retraction request on Game (id: ${auctionId}) of Slot ${slot}`, auctionId: auctionId, senderId: noteReceiverId, receiverId: noteSenderId, response: 'NONE', viewed: false
      }:
      {
          type:"RETRACTION_RECEIVE", message: `Host ${_.startCase(name)} (id: ${receiverId}) decline retraction request on Game (id: ${auctionId}) of Slot ${slot}`, auctionId: auctionId, senderId: noteReceiverId, receiverId: noteSenderId, response: 'NONE', viewed: false
      }
      const sendBackMsg = await db.notification.create(obj).then(()=>{
        if(receiver !== null){
          // console.log("I am bere2")
          // console.log(onlineUsers)
          io.to(receiver).emit(
            // maybe item is not being removed?
            "increaseNotifyCount", obj
          )
        }
      }
      );
    }catch(err){
      console.log(err.message)
    }
  } )
}})

server.listen(9001, ()=>{
    console.log("running on port 9001")
})
