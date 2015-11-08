const VISIBILITY_RADIUS = 500; //meters

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
var auth0 = require('auth0');

var dotenv = require('dotenv');
dotenv.load();

var app = express();

var authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

var auth0_api = new auth0({
  domain:       process.env.AUTH0_DOMAIN,
  clientID:     process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB);

var MemoSchema = new Schema({
  message:  { type: String, default: '' },
  user:     { type: String },
  email:    { type: String },
  nickname: { type: String },
  date:     { type: Date, default: Date.now },
  loc:      { type: { type: String }, coordinates: [] }
});
MemoSchema.index({ loc: '2dsphere' });

var Memo = mongoose.model('Memo', MemoSchema);

// Configure App
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use('/api', authenticate);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, 'bower_components')));

if ('development' == app.get('env')) {
  app.use(errorHandler());
}
// END Configure App

app.get('/api/memos', function(req, res, next) {

  Memo
    .find()
    .exec( function (err, memos) {
      if( err ) return next( err );

      res.json(memos);
    })
});

app.post('/api/memos/near', with_location, function(req, res, next) {

  var conditions = {
    loc: {
      $near : {
        $maxDistance: VISIBILITY_RADIUS,
        $geometry: {
          type: 'Point',
          coordinates: [ req.coordinates.longitude, req.coordinates.latitude ]
        }
      }
    }
  };

  Memo
    .find(conditions)
    .limit(50)
    .exec( function (err, memos) {
      if( err ) return next( err );

      res.json(memos);
    })
});

app.post('/api/memos', authenticate, with_location, function(req, res, next) {

  auth0_api.getUser(req.user.sub, function(err, user) {

    var memo = Memo();
    memo.message = req.body.message;
    memo.user = user.user_id;
    memo.nickname = user.nickname;
    memo.email = user.email;
    memo.loc = {
      type: 'Point',
      coordinates: [ req.coordinates.longitude, req.coordinates.latitude ]
    }

    memo.save(function (err, memo, count) {
      if( err ) return next( err );

      res.json(memo);

      // generate some fake messages
      if (req.body.generate_fakes) {
        var i = 10;
        var dummy_memos = [];
        var faker = require('faker');

        do {
          var one_dummy = Memo();
          var fake_coords = randomGeo({latitude:req.coordinates.latitude,longitude:req.coordinates.longitude}, 1000);
          one_dummy.message = faker.lorem.sentences(3);
          one_dummy.user = req.user.sub;
          one_dummy.nickname = user.nickname;
          one_dummy.email = user.email;
          one_dummy.loc = {
            type: 'Point',
            coordinates: [ fake_coords.longitude, fake_coords.latitude ]
          }
          one_dummy.save(function (err) {
            if (err) {
              console.log('error creating dummy docs');
            } else {
              console.log('SUCCESS. Fake created');
            }
          });
        } while (i-- > 0);
      }

    });
  });

})

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('MemoTown server listening on port ' + app.get('port'));
});

// Custom Middleware
function with_location(req, res, next) {
  req.coordinates = {
    longitude: parseFloat(req.body.longitude),
    latitude: parseFloat(req.body.latitude)
  };

  next();
}

// Support functions
function randomGeo(center, radius) {
    var y0 = center.latitude;
    var x0 = center.longitude;
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    return {
        'latitude': y + y0,
        'longitude': x + x0
    };
}
