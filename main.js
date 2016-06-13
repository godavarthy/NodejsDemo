/**
 * 
 */
var express = require('express');
var multer  =   require('multer');
var http = require('http');
var ts  =   require('typescript');
var fs = require("fs");
var unzip = require('unzip');
var shell = require('shelljs');
var tsc = require('typescript-compiler');
var archiver = require('archiver');
var events = require('events');
var app = express();
var eventEmitter = new events.EventEmitter();
var port = 3000;
var filename;
var outFolder;
var jsFolder
var resObj;
app.use(express.static(__dirname + '/views'));

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
			jsFolder = outFolder+'/js';
			shell.mkdir('-p', jsFolder);
			for (var i in files){
				var cmdTxt = outFolder+'/'+files[i];
				console.log( cmdTxt );
				tsc.compile(cmdTxt, ['--outDir', jsFolder]);
				data += files[i] + " ";
				console.log( data);
			}
			
			
			eventEmitter.emit('pipeZip');
	}
	var zipFiles = function () {
		var output = fs.createWriteStream(outFolder+'/compiledJs.zip');
		var archive = archiver('zip');

		output.on('close', function () {
		    console.log(archive.pointer() + ' total bytes');
		    console.log('archiver has been finalized and the output file descriptor has closed.');
			eventEmitter.emit('pipeResponse');
		});

		archive.on('error', function(err){
		    throw err;
		});

		archive.pipe(output);
		archive.bulk([
		    { expand: true, cwd: jsFolder, src: ['**'], dest: 'source'}
		]);
		archive.finalize();
		
		
	}
	var response = function () {
		console.log(" before response");
		resObj.download( outFolder+'/compiledJs.zip' );
	}
	eventEmitter.addListener('pipeZip', zipFiles);
	eventEmitter.addListener('pipeResponse', response);
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
app.get('/', function(req, res) {
    res.sendfile('test.html', {root: './views' })
});

var server = http.createServer(app).listen(process.env.PORT || port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});
