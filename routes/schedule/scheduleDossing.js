const express = require('express')
const router = express.Router()
const connection = require("../../config/database");

// GET
// NUTREINT PREPARATION //

router.get('/api/schedule/manong/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM manongdebug_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

// POST //
// NUTREINT PREPARATION //

router.post('/api/setSchedule/manong/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO manongdebug_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          console.log('post manong nutrient success')
          status = 'Success'
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})  


// DELETE //
//  NUTRIENT PREPARATION //

router.delete('/api/schedule/manong/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM manongdebug_nutrient_schedule WHERE date = "${req.body.date}"`;
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