/**
 * 
 */
var express = require('express');
var multer  =   require('multer');
var http = require('http');
var fs = require("fs");
var unzip = require('unzip');
var shell = require('shelljs');
var app = express();
var port = 3000;
var filename;
var outFolder;
var resObj;

	var storage =   multer.diskStorage({
		  destination: function (req, file, callback) {
		    callback(null, './inFolder');
		  },
		  filename: function (req, file, callback) {
		     filename = file.fieldname + '-' + Date.now()+'.zip';
		     outFolder = './outFolder/' + filename;
		    callback(null, filename);
		  }
	});
	var readFolder = function () {
		var data = "name of files are ";
			console.log( "incb");
			var files = fs.readdirSync(outFolder)
			console.log( files);
			for (var i in files){
				data += files[i] + " ";
				console.log( data);
			}
			resObj.end( data );
	}
	var upload = multer({ storage : storage}).single('datafile');

	var postUploadHandler = function(req,res){
		
		upload(req,res,function(err) {
			
	        if(err) {
	            return res.end("Error uploading file.");
	        }
	        else{
				console.log( filename);
				resObj = res;
				shell.mkdir('-p', outFolder);
				var unzipExtractor = unzip.Extract({ path: outFolder });
	        	var zipStream = fs.createReadStream('./inFolder/'+filename);       
	        	zipStream.pipe(unzipExtractor);
	        	console.log( "res process");
	        	unzipExtractor.on('close', readFolder);
	        	
		       
	        	}
	    });
	}
	app.post('/demo',postUploadHandler);
	

app.set('view engine', 'jade');
app.get('/index', function(req, res) {
    res.sendfile('test.html', {root: './views' })
});

var server = http.createServer(app).listen(process.env.PORT || port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});
