var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var multer = require('multer');
var mysql = require('mysql');
var mustacheExpress = require('mustache-express');

var app = express();
var upload = multer();

app.engine('html', mustacheExpress());
app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
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
    res.render('login.html');
  } else {
    my.getAppData(userDB, user.id, function(apps) {
      res.render('apps.html', apps);
    });
  }
});

app.post('/api/login', function(req, res, next) {
  console.log("req body is " + JSON.stringify(req.body));
  if (!user) {
    Login.execute(userDB, req, res, function(user) {
      my.getAppData(userDB, user.id, function(apps) {
        res.render('apps.html', apps);
      });
    });
  } else {
    res.send("You are already login");
  }
});

app.get('/api/logout', function(req, res) {
  user = undefined;
  apps = undefined;
  res.render('login.html');
});

app.listen(8001, '127.0.0.1');
