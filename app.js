
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , files =require('./routes/files')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser('likeshan'));
app.use(express.session({ secret: "fileserver" }));// add session 

app.use(app.router);
global.filedir='/home/lafeng/workspace/FileServer/assert';
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(global.filedir));
app.set('fileroot', global.filedir);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/download', routes.download);
app.get('/list/(:showType)?', files.listfile);
app.get('/delete', files.deletefile);
app.get('/loadImg',files.ajaxfiles);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
