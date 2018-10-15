var sqlite = require("sqlite3");
var db = new sqlite.Database('info.db');

db.each("SELECT uname FROM users", function(err, row) {
  console.log(row.uname);
});
