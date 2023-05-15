/*
    the main entry point of backend server
*/
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {db} = require("./models")
const userRouter = require('./routes/userRouter')
const auctionRouter = require('./routes/auctionRouter');
const winningNumberRouter = require('./routes/winningNumberRouter');
const bidRouter = require('./routes/bidRouter')
const notificationRouter = require('./routes/notificationRouter')
const productRouter = require('./routes/productRouter')
const axios = require('axios')
const qs = require('qs')
const multer = require('multer')
const _ = require('lodash')
const cron = require('node-cron')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const ip = 'http://18.215.172.154:9001'
const utils = require('./utils')

// consistent update the status of Games that close in the morning 
cron.schedule(`${utils.daySec} ${utils.dayMin} ${utils.dayHour} * * *`, async ()=>{
  let data = qs.stringify({
   
  });
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

// consistent update the status of Games that close in the morning with day hour saving
cron.schedule(`${utils.daySec} ${utils.dayMin} ${utils.dayHourSaving} * * *`, async ()=>{
  let data = qs.stringify({
   
  });
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

// consistent update the status of Games that close in the evening
cron.schedule(`${utils.nightSec} ${utils.nightMin} ${utils.nightHour} * * *`, async ()=>{
  let data = qs.stringify({
   
  });
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

// consistent update the status of Games that close in the evening with day hour saving
cron.schedule(`${utils.nightSec} ${utils.nightMin} ${utils.nightHourSaving} * * *`, async ()=>{
  let data = qs.stringify({
   
  });
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
app.use(bodyParser.urlencoded({
    extended:true,
}))
app.use(express.json())
app.use(cookieParser())
//allow credientials across from other domain
app.use(
    cors({
      origin: ["http://18.215.172.154:3000", "http://localhost:3000", 'http://3.85.196.187:3000',
      "http://18.215.172.154:9001"],
      credentials: true,
    })
  );

// import winning number section of the api
app.use('/winningNum', winningNumberRouter)
// import game section of the api
app.use('/auction', auctionRouter)
// import user section of the api
app.use('/user', userRouter)
// import bid section of the api
app.use('/bid', bidRouter)
// import notifications section of the api
app.use('/notifications', notificationRouter)
// import product section of the api
app.use('/product', productRouter)

// section of posting images of the api
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

// the home page of the api
app.get('/', (req, res) =>{
    res.send("hello");
})


const server = require('http').createServer(app);
// implement the io socket for immediate communication
const io = require('socket.io')(server, {cors:{origin:"*"}})
let onlineUsers = new Map();


const addNewUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId)
};

const getUser = (userId) => {
  return onlineUsers.get(userId) || null;
};

// initialize connection of new user
io.on('connection', (socket)=>{{
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  // listening for event of new notification and update the database
  socket.on("createNotification", async({name, auctionId, slot, senderId, receiverId})=>{
    const receiver = getUser(receiverId);
    let obj = {
      type: "RETRACTION_SEND", message: `Player ${_.startCase(name)} (id: ${senderId}) request retraction of Game (id: ${auctionId}) on Slot ${slot}`,
      auctionId: auctionId, senderId: senderId, receiverId: receiverId, 
    }
    try{
      const result = await db.notification.create(obj);
      if(receiver !== null){
        // emit event of increasing notification count
        io.to(receiver).emit(
          "increaseNotifyCount", result.dataValues
        )
      }
    }catch(err){
      console.log(err.messagr)
    }
  })
  
  // listening for event of handling event response and update the database
  socket.on("increaseCount", async ({receiverId, response, id, slot, auctionId, name})=>{
    const receiver = getUser(receiverId);
    try{
      const result = await db.notification.update(
          {response: response==="ACCEPT"?"ACCEPT":"DECLINE" },
          {
              where:{
                  id: id
              }
          }
      )
      const matchNote = await db.notification.findOne(
        {
            where: {
                id: id
            }
        }
      )

      if(response === "ACCEPT"){
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
        }).catch((error) => {
          throw new Error("Failed to delete selection")
        })

      }

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
          io.to(receiver).emit(
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

// the backend is listening on port 9001
server.listen(9001, ()=>{
    console.log("running on port 9001")
})