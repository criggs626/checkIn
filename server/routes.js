const ROOT_DIR = "../front/"
const DEBUG = true;

module.exports = function (app, express, db, passport){
  var path = require('path');
  app.use(express.static(ROOT_DIR));

  app.get("/home", isLoggedIn, function(req, res){
    send(res, "home.html");
  });

  app.get("/admin", isLoggedIn, isAdmin, function(req, res){
    send(res, "admin.html");
  });

  app.get("/createEvent", isLoggedIn, isAdmin, function(req, res){
    send(res, "create.html");
  });

  app.get("/getEvents", isLoggedIn, function(req, res){
    db.all("select * from events order by event_id desc", function(err, rows) {
      res.json(rows);
    });
  });

  app.post("/createEvent", isLoggedIn, isAdmin, function(req, res){
    db.run("insert into events (name,date) values('"+req.body.name+"', '"+req.body.date+"');");
    send(res,"admin.html");
  });

  app.post("/notCheckedIn", isLoggedIn, function(req, res){
    db.all("select * from kids where kid_id not in(select kid from attendance where event="+req.body.event+")", function(err,rows){
      res.json(rows);
    });
  });

  app.post("/checkedIn", isLoggedIn, function(req, res){
    db.all("select * from kids where kid_id in(select kid from attendance where event="+req.body.event+")", function(err,rows){
      res.json(rows);
    });
  });

  app.post("/checkin", isLoggedIn, function(req, res){
    db.run("insert into attendance (kid,event) values('"+req.body.kid+"', '"+req.body.event+"');");
    res.send("Success");
  });

  app.post("/addKid", isLoggedIn, function(req, res){
    console.log("New Kid Added");
    db.run("insert into kids (fname,lname,bday,gender,school,email,phone,pname,address) values('"
      +req.body.fname+"', '"+req.body.lname+"', '"+req.body.bday+"', '"+req.body.gender+"', '"
      +req.body.school+"', '"+req.body.email+"', '"+req.body.phone+"', '"+req.body.pname
      +"', '"+req.body.address+"');");
    db.all("select kid_id from kids where fname='"+req.body.fname+"' and lname='"+req.body.lname+"' order by kid_id desc;", function(err, rows) {
      db.run("insert into attendance (kid,event) values('"+rows[0].kid_id+"', '"+req.body.event+"');");
    });
    res.send("Success")
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/' // redirect back to the signup page if there is an error
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/");
  });

  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() || DEBUG){
      return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
    console.log('Not logged in, redirecting...');
  }

  function isAdmin(req, res, next) {
    // if user is admin in the session, carry on
    priv=(DEBUG) ? "admin" : req.user.privilege;
    if (priv=="admin"){
      return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/home');
    console.log('Not Admin, redirecting...');
  }

  function send(request, file) {
    request.sendFile(path.join(__dirname, ROOT_DIR, file));
  }

  app.use("/", function(req, res) {
    send(res, "login.html");
  });
}
