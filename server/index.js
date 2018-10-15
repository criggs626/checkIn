var sqlite = require("sqlite3");
var hash = require("sha256");
var express = require("express");
var app = express();
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = new sqlite.Database('info.db');
const port = 8080

require('./passport.js')(db, hash, passport);

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(session({
	secret: 'thisisthekidschurchsessionsecretthing',
	resave: true,
	saveUninitialized: true
 } ));

app.use(passport.initialize());
app.use(passport.session());

require("./routes.js")(app, express, db, passport);
app.listen(port, function () {
  console.log("Example app listening on port %d!", port);
});
