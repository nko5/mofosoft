var http = require('http');
var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();

var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var jwt = require('express-jwt');
var dotenv = require('dotenv');

app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.send(200, {text: "All Good In the Hood!"});
});

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
