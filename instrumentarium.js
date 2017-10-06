var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var credentials = require('./credentials');
var mysql = require('mysql');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('x-powered-by', false);

app.use(function (req, res, next) {
  console.log("[Always middleware execution] req is ", req.url);
  next();
});

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser(credentials.cookieSecret, {
  maxAge: 20000,
  secure: true,
  httpOnly: true,
  signed: true
}));

var Login = require('./Login');
var UserDB = require('./UserDB');

var userDB = mysql.createConnection(UserDB.get());
userDB.connect();

var applications = require('./apps');

app.get('/', function (req, res) {
  if (req.signedCookies.session_id) {
    applications.getAppDataBySessionId(userDB, req.signedCookies.session_id, function (apps) {
      console.log(apps);
      app.locals.styles = '<link rel="stylesheet" href="/css/app.css">';
      res.render('apps');
    }, function (msg) {
      console.log(msg);
      app.locals.styles = '<link rel="stylesheet" href="/css/login.css">';
      res.render('login', {
        header: "Авторизуйтесь",
        msg: msg
      });
    });
  } else {
    app.locals.styles = '<link rel="stylesheet" href="/css/login.css">';
    res.render('login', {
      header: "Авторизуйтесь"
    });
  }
});

app.get('ajax/pomodoro', function (req, res) {
  if (req.signedCookies.session_id) {
    var json = {
      name: 'pomodoro',
      html: '<div>I am pomodoro!!!</div>',
      js: ['js/pomodoro.js'],
      css: ['css/pomodoro.css']
    };
    res.json(json);
  }
  else {
    res.render('login');
  }
});

app.get('ajax/cites', function (req, res) {
  if (req.signedCookies.session_id) {
    var json = {
      name: 'cites',
      html: '<div>I am cites!!!</div>',
      js: ['js/cites/js'],
      css: ['css/cites.css']
    };
    res.json(json);
  }
  else {
    res.render('login');
  }
});

app.post('/api/login', function (req, res, next) {
  console.log("req body is " + JSON.stringify(req.body));

  Login.execute(userDB, req, res, function (user) {
    if (user) {
      applications.getAppDataBySessionId(userDB, user.session_id, function (apps) {
        res.cookie('session_id', user.session_id, {
          signed: true
        });
        console.log(apps);
        app.locals.styles = '<link rel="stylesheet" href="/css/app.css">';
        res.redirect('/');
      }, function (msg) {
        console.log(msg);
        app.locals.styles = '<link rel="stylesheet" href="/css/login.css">';
        res.render('login', {
          header: "Авторизуйтесь",
          msg: msg
        });
      });
    } else {
      app.locals.styles = '<link rel="stylesheet" href="/css/login.css">';
      res.render('login', {
        header: "Попробуйте еще раз"
      });
    }
  });
});

app.listen(80, '188.127.251.91');
