var express = require('express');
var app = express();

app.get('/demo', function (req, res) {
  
       console.log( "req done");
       res.end( "Hello word");
  
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})