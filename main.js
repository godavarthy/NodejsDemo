/**
 * 
 */
var express = require('express');
var multer  =   require('multer');
var http = require('http');
var fs = require("fs");
var unzip = require('unzip');
var app = express();
var port = 3000;
var filename;
	var storage =   multer.diskStorage({
		  destination: function (req, file, callback) {
		    callback(null, './inFolder');
		  },
		  filename: function (req, file, callback) {
		     filename = file.fieldname + '-' + Date.now();
		    callback(null, filename);
		  }
	});
	var upload = multer({ storage : storage}).single('datafile');

	
	app.post('/demo',function(req,res){
		
		
	    upload(req,res,function(err) {
		
	        if(err) {
	            return res.end("Error uploading file.");
	        }
	        else{
			console.log( filename);
	        	var data = "name of files are ";
	        	var zipStream = fs.createReadStream('./inFolder/'+filename);       
	        	zipStream.pipe(unzip.Extract({ path: './outFolder' }));

	        	var files = fs.readdirSync('./outFolder')
	        	console.log( files);
	        	for (var i in files){
	        		data += files[i] + " ";
	        		console.log( data);
	        	}
	        	res.end( data );
	        }
	    });
	});
	

app.set('view engine', 'jade');
app.get('/index', function(req, res) {
    res.sendfile('test.html', {root: './views' })
});

var server = http.createServer(app).listen(process.env.PORT || port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});
