var http = require('http');
var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();
var jwt = require('express-jwt');
var dotenv = require('dotenv');

var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.configure(function() {
//
//
//   app.use(app.router);
// });
//
// //Get the dummy data
// require('./server/ddata.js');

app.get('/', function(req, res) {
  res.render('pages/index');
})

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
