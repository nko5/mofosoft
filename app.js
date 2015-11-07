var http = require('http');
var express = require('express');
var path = require('path');
var cors = require('cors');

var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var jwt = require('express-jwt');
var mongoose = require('mongoose');

var dotenv = require('dotenv');
dotenv.load();

var app = express();

var authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB);

var MemoSchema = new Schema({
    message  :  { type: String, default: '' }
  , date  :  { type: Date, default: Date.now }
});

var Memo = mongoose.model('Memo', MemoSchema);

// Configure App
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', authenticate);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, 'bower_components')));

if ('development' == app.get('env')) {
  app.use(errorHandler());
}
// END Configure App

app.get('/', function(req, res, next) {
  Memo
    .find()
    .exec( function (err, memos) {
      if( err ) return next( err );

      res.send({memos: memos});
    })
});

app.get('/memos', function(req, res, next) {
  Memo
    .find()
    .exec( function (err, memos) {
      if( err ) return next( err );

      res.send({memos: memos});
    })
});

app.post('/api/postmemo', function(req, res, next) {
  var memo = Memo();
  memo.message = req.body.message;
  memo.save(function (err, memo, count) {
    if( err ) return next( err );

    res.redirect('/memos');
  });
})

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('MemoTown server listening on port ' + app.get('port'));
});
