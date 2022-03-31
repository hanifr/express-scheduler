const express = require('express')
const router = express.Router()
const connection = require("../../config/database");

// GET //
// // DRIPPING WATER/NUTRIENT //

router.get('/api/schedule/manong',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM manongdebug_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})


// POST //
// DRIPPING WATER/NUTRIENT //
  
router.post('/api/setSchedule/manong',(req,res)=>{
    let dateArray = req.body.params.date
    let time = req.body.params.time
    let duration = req.body.params.duration
    let substance = req.body.params.substance
    let status=''
  
    let stringMysql = ''
    dateArray.forEach((date, index, array)=>{

      if(index === array.length - 1){
        stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
      }else{
        stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
      }
    })
    // console.log(stringMysql)
        // ret = JSON.stringify(ipah1)
        // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
        var q = `INSERT INTO manongdebug_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
        connection.query(q, function (error, row, fields) {
          if (error) {
            console.log(error);
            status = error.sqlMessage
          }
          if (row) {
            status = 'Success'
          //  console.log(row)
          }
        //   client.publish('debug/test/database/ipah1', 'updated')
        //   res.header('Content-Type', 'application/json; charset=utf-8')
          res.send(status)
        });
    ;
})

// DELETE //
// DRIPPING WATER/NUTRIENT //

router.delete('/api/schedule/manong',(req,res)=>{
dat = [];
var q = `DELETE FROM manongdebug_schedule WHERE date = "${req.body.date}"`;
// connection.connect();
connection.query(q, function (error, row, fields) {
if (error) {
  console.log(error);
}
if (row) {
  res.json('deleted')

}
});
})

module.exports = router