var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var multer = require('multer');
var mysql = require('mysql');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

var app = express();
var upload = multer();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('x-powered-by', false);

app.use(bodyParser.urlencoded({
  extended: true
}));

var Login = require('./Login');
var UserDB = require('./UserDB');

var userDB = mysql.createConnection(UserDB.get());
userDB.connect();

var user;
var apps;

var my = require('./apps');

app.get('/', function(req, res) {
  if (!user) {
    res.render('login');
  } else {
    my.getAppData(userDB, user.id, function(apps) {
      res.render('apps');
    });
  }
});

app.post('/api/login', function(req, res, next) {
  console.log("req body is " + JSON.stringify(req.body));
  if (!user) {
    Login.execute(userDB, req, res, function(user) {
      if (user) {
        my.getAppData(userDB, user.id, function(apps) {
          res.render('apps');
        });
      }
    });
  } else {
    res.send("You are already login");
  }
});

app.get('/api/logout', function(req, res) {
  user = undefined;
  apps = undefined;
  res.render('login');
});

app.listen(8001, '127.0.0.1');
