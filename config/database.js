const mysql = require("mysql");

// const connection = mysql.createPool ({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "nexplex_agriculture",
//   port: 3306,
// });
const connection = mysql.createPool ({
  host: "192.168.0.108",
  // host: "192.168.0.165",
  user: "root",
  password: "c1vG7R34",
  database: "agriculture",
  port: 3306,
});

module.exports = connection;