console.error('Starting');
var fs     = require('fs');
var http   = require('http');
var sqlite = require('sqlite3');
var db     = new sqlite.Database("db.sqlite");

var tableCheck = "SELECT name FROM sqlite_master WHERE type='table' AND name='LOREM';";
db.get(tableCheck, function(err, exists) {
  if (exists.length == 0) {
    db.serialize(function() {
      db.run("CREATE TABLE LOREM (info TEXT)");
      
      var stmt = db.prepare("INSERT INTO LOREM VALUES (?)");
      for (var i=0; i<10; i++) {
        stmt.run("Ipsum " +i);
      }
      stmt.finalize();
    });
  }
});



  

http.createServer(function(req, res) {
  var layout  = fs.readFileSync('index.html', 'utf8');
  var content = '';
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    content += row.id + ": " + row.info + "<br/>";
  }, function() {
    res.end(layout.replace("{{content}}", content));
  });
}).listen(3000, function() {
  console.log('Listening');
});
