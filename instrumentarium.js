var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

var app = express();

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

var my = require('./apps');

app.get('/', function(req, res) {
  res.render('login');
});

app.post('/api/login', function(req, res, next) {
  console.log("req body is " + JSON.stringify(req.body));
  Login.execute(userDB, req, res, function(user) {
    if (user) {
      my.getAppData(userDB, user.id, function(apps) {
        res.render('apps');
      });
    }
  });
});

app.listen(8001, '127.0.0.1');
