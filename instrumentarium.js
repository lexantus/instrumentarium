var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var upload = multer();
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

app.get('/ajax/pomodoro', function (req, res) {
  if (req.signedCookies.session_id) {
    var json = {
      status: 'ok',
      name: 'pomodoro',
      html: `
<div id="clock">00:00</div>
<div id="work" class="icon">start</div>
<div id="short_break" class="icon">short break</div>
<div id="long_break" class="icon">long break</div>
<div id="result"></div>`.trim(),
      js: ['/js/pomodoro.js'],
      css: ['/css/pomodoro.css']
    };
    res.json(json);
  }
  else {
    res.render('login');
  }
});

app.get('/ajax/pomodoro/complete', function (req, res) {
  if (req.signedCookies.session_id)
  {
    var json = {
      status: 'ok',
      message: 'Good work!'
    };
    res.json(json);
  }
  else {
    res.render('login');
  }
});

app.get('/ajax/pomodoro/break_complete', function (req, res) {
  if (req.signedCookies.session_id)
  {
    var json = {
      status: 'ok',
      message: 'Break complete!'
    };
    res.json(json);
  }
  else {
    res.render('login');
  }
});

app.get('/ajax/pomodoro/long_break_complete', function (req, res) {
  if (req.signedCookies.session_id)
  {
    var json = {
      status: 'ok',
      message: 'Long break complete'
    };
    res.json(json);
  }
  else {
    res.render('login');
  }
});


app.get('/ajax/cites', function (req, res) {
  if (req.signedCookies.session_id) {
    var json = {
      status: 'ok',
      name: 'cites',
      html: `
<form id="addCiteForm" action="/ajax/addCite" method="post">
  <h2>Add cite</h2>
  <label for="cite">Cite:</label>
  <textarea name="cite" id="cite" rows="6" cols="30" required></textarea>
  Author:
  <select name="author" id="author">
    <option value="noAuthor" selected>-</option>
    <option value="Достоевский">Достоевский</option>
    <option value="Гоголь">Гоголь</option>
  </select>
  <button>Add author</button>
  <button type="submit">Add cite</button>
</form>`.trim(),
      js: ['/js/cites.js'],
      css: ['/css/cites.css']
    };
    res.json(json);
  }
  else {
    res.render('login');
  }
});

app.post('/ajax/cites/addCite', upload.array([]), function (req, res) {
    console.log('addCite ' + req);
    res.json({status: 'ok', message: 'Cite is successfully added', req: req.body});
});

app.post('/api/login', function (req, res) {
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
