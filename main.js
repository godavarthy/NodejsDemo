var express = require('express');
var http = require('http');

var app = express();
var port = 3000;

app.get('/demo', function (req, res) {
  
       console.log( "req done");
       res.end( "Hello word");
  
})


var server = http.createServer(app).listen(process.env.PORT || port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});