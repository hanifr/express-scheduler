const express = require('express')
const app = express()
const port = 7777
const cors = require('cors')
const moment = require('moment')
const connection = require("./config/database");
const passport = require( 'passport' );
var mqtt = require('mqtt')
// var client  = mqtt.connect('wss://broker.hivemq.com:8083/mqtt')
// var client  = mqtt.connect('mqtt://broker.hivemq.com:1883')
// var client  = mqtt.connect('ws://www.txio.live:8083/mqtt')
// var client  = mqtt.connect('mqtt://192.168.0.165:1883')
var client  = mqtt.connect('mqtt://192.168.8.190:1883')

const schedule = require('node-schedule');

  var ret = [];
  var dat = [];
  var ipah1 = []

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(async function (user, done) {
    done(null, user);
  });
  app.use(cors())
  app.use( express.json() );
  app.use( express.urlencoded( { extended: false } ));


// CREATE JOB SCHEDULE FOR DRIPPING WATER/NUTRIENT

  function getUpdatedDataManong(){
    if(typeof jobManong !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobManong;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeManongArrayLength;i++){
         if(schedule.scheduledJobs[`manong${i}`]){
           schedule.scheduledJobs[`manong${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM manongdebug_schedule WHERE date = CURDATE()`;
       // connection.connect();
       connection.query(q, function (error, row, fields) {
         if (error) {
           console.log(error);
         }
         if (row) {
  //  console.log(row)
           for (var i = 0; i < row.length; i++) {
             let timeArray  = row[i].time.split(',')
             let durationArray  = row[i].duration.split(',')
             let substanceArray = row[i].substance.split(',')
            //  console.log(substanceArray)
             timeArray.forEach((element,index) => {
               jobManong = schedule.scheduleJob(`manong${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Manong Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/seaic/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
  
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeManongArrayLength=timeArray.length
           }
         }
      });
  }

// CREATE JOB SCHEDULE FOR NUTRIENT PREPARATION

function getUpdatedDataManongNutrient(){
  if(typeof jobManongNutrient !== 'undefined'){
    delete jobManongNutrient;
    for(i=0; i<timeManongArrayLength;i++){
      if(schedule.scheduledJobs[`manongNutrient${i}`]){
        schedule.scheduledJobs[`manongNutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM manongdebug_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobManongNutrient = schedule.scheduleJob(`manongNutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Manong Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/seaic/n', `{"D1":10,"D2":${ec}}`)
        });
        timeManongArrayLength=row.length
      }
    }
  });
}

// // // // // //

app.get('/', (req, res) => {
  client.publish('debug/test/express','Hello World From Express!')
  res.send(new Date().toLocaleTimeString())
})


// API FOR SCHEDULE
app.use("/", require("./routes/schedule/scheduleDripping"))
app.use("/", require("./routes/schedule/scheduleDossing"))


app.get('/api/dailySchedule/manong',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM manongdebug_schedule WHERE date = CURDATE()`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      //  console.log(row)
               for (var i = 0; i < row.length; i++) {
                 let timeArray  = row[i].time.split(',')
                 let durationArray  = row[i].duration.split(',')
                 let substanceArray = row[i].substance.split(',')
                //  console.log(substanceArray)
               }
             }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(row)
  });
})

app.get('/api',(req,res)=>{
  dat = [];
  var q = `show databases;`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      //  console.log(row)
            //    for (var i = 0; i < row.length; i++) {
            //      let timeArray  = row[i].time.split(',')
            //      let durationArray  = row[i].duration.split(',')
            //      let substanceArray = row[i].substance.split(',')
            //     //  console.log(substanceArray)
            //    }
             }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(row)
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

setInterval(()=>{

// DRIPING WATER/NUTRIENT
getUpdatedDataManong()

// NUTRIENT PREPARATION
getUpdatedDataManongNutrient()
},10000)

setInterval(() => {
  client.publish("test","Hello world")
}, 1000);