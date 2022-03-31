// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require("bcrypt");

const connection = require("./database");

connection.query(`USE nexplex_agriculture`);

module.exports=function(passport){

  passport.use('web-local',
    new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password'
        },

        async function ( email, password, done) {
          // console.log(email)
          connection.query(
            "SELECT * FROM nexplex_agriculture_users WHERE email = ? ",
            [email],
            function (err, rows) {
              console.log('here')
              if (err) {
                return done(err);
              }
              if (!rows.length) {
                return done(null, false, { msg: "No user found" });
              }
              bcrypt.compare(password, rows[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
  
                  return done(null, rows[0]);
                } else {
                  return done(null, false, { msg: "Password Incorrect" });
                }
              });
            }
          );
        }
    )
);

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(async function (id, done) {
//   try{
//   connection.query("SELECT * FROM users WHERE id = ? ", [id], function (
//     err,
//     rows
//   ) {
//     done(err, rows[0]);
//   });
// }catch(e){
//   done(e)
// }
// });

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(async function (user, done) {
//   done(null, user);
// });

let user={};
const opts = {};


opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'JWT_SECRET_OR_KEY2';
passport.use('web-jwt',
    new JwtStrategy(opts, async function(payload, done) {
      console.log(payload)
      console.log('jheeeeee')
      connection.query(
        "SELECT * FROM nexplex_agriculture_users JOIN nexplex_server on server_id=1 WHERE nexplex_agriculture_users.id = ?",
        // "SELECT * FROM nexplex_users LEFT JOIN nexplex_topics ON nexplex_users.id=nexplex_topics.userID WHERE nexplex_users.id = ?",
        [payload], (err,results) =>{
          // if(err) console.log(err)
          console.log(results)
          // if(results[0].topics){
          //   const topic=[results[0].topics, results[0].topics.slice(0, -4)+'server']
          //   user={
          //     userId:results[0].id,
          //     username: results[0].userName.toUpperCase(),
          //     topics:topic,
          //     deviceID:results[0].deviceID,
          //     scope:[results[0].role]
          //   }
            // console.log(user)
          // }else{
            user={
              userId:results[0].id,
              username: results[0].username.toUpperCase(),
              // topics:results[0].topics,
              station:[results[0].station],
              scope:[results[0].role],
              server_mqtt:results[0].server_mqtt
            }
          // }

          if (payload==user.userId) {
             return done(null, user);
          }
          return done(null, false,{msg:"PLEASE"});
        })
    })
  );
}

// module.exports=passport