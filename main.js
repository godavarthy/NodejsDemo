var express = require('express');
var http = require('http');
var fs = require("fs");
var unzip = require('unzip');
var app = express();
var port = 3000;

app.get('/demo', function (req, res) {
  
       console.log( "req done");

var data = "name of files are ";
       
fs.createReadStream('C:/nodeDemo/demoFiles.zip').pipe(unzip.Extract({ path: 'C:/nodeDemo/unzipFolder' }));

fs.createReadStream('C:/nodeDemo/demoFiles.zip')
  .pipe(unzip.Parse())
  .on('entry', function (entry) {
    var fileName = entry.path;
	console.log( fileName);
    var type = entry.type; // 'Directory' or 'File' 
    var size = entry.size;
	data += fileName +" ";
console.log( data );
    
  });
res.end( data );
  
});


var server = http.createServer(app).listen(process.env.PORT || port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});
