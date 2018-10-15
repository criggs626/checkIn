var LocalStrategy = require('passport-local').Strategy;

module.exports = function(db, hash, passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.user_id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    db.each("select * from users where user_id = ? ",[id], function(err, rows){
      done(err, rows);
    });
  });


  passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
    usernameField : 'uname',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, uname, password, done) {
    db.each("select * from users where uname = '" + uname + "'", function(err,rows) {
      if (err){
        return done(err);
      }
      if (!rows.uname) {
        return done(null, false, console.log("no user found"));
      }
      // if the user is found but the password, check if the password is wrong
      pass=rows.password;
      if (!( pass == hash(password))){
        return done(null, false, console.log("Wrong Password")); // create the loginMessage and save it to session as flashdata
      }
      // all is well, return successful user
      return done(null, rows);
    });
  }));
};
