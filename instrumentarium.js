var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var credentials = require('./credentials');
var mysql = require('mysql');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

var app = express();
var upload = multer();

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
  if (req.signedCookies.session_id) {
    var t = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var q = 'INSERT INTO pomodoro (type, time, session_id) VALUES ("0", "' + t + '", "' + req.signedCookies.session_id + '")';
    userDB.query(q, function (err) {
      if (err) throw err;
      res.json({
        status: 'ok',
        message: 'Good work!'
      });
    });
  }
  else {
    res.render('login');
  }
});

app.get('/ajax/pomodoro/break_complete', function (req, res) {
  if (req.signedCookies.session_id) {
    var t = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var q = 'INSERT INTO pomodoro (type, time, session_id) VALUES ("1", "' + t + '", "' + req.signedCookies.session_id + '")';
    userDB.query(q, function (err) {
      var json = {
        status: 'ok',
        message: 'Break complete!'
      };
      res.json(json);
    });
  }
  else {
    res.render('login');
  }
});

app.get('/ajax/pomodoro/long_break_complete', function (req, res) {
  if (req.signedCookies.session_id) {
    var t = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var session_id = req.signedCookies.session_id;
    userDB.query(`insert into pomodoro (type, time, session_id) values ("2", "${t}", "${session_id}")`,
      function (err) {
        var json = {
          status: 'ok',
          message: 'Long break complete'
        };
        res.json(json);
      });
  }
  else {
    res.render('login');
  }
});

app.get('/ajax/cites', function (req, res) {
  if (req.signedCookies.session_id) {
    userDB.query('SELECT * FROM author', function (err, results) {
      var selectAuthor = '<select name="author" id="author"><option value="-1" selected>-</option>';
      var n = results.length;
      for (var i = 0; i < n; i++) {
        selectAuthor += `<option value="${results[i].id}">${results[i].name}</option>`;
      }
      selectAuthor += '</select>';

      var json = {};
      json.status = 'ok';
      json.name = 'cites';
      json.html = `
<form id="addCiteForm" action="/ajax/addCite" method="post">
<h2>Add cite</h2>
<label for="cite">Cite:</label>
<textarea name="cite" id="cite" rows="6" cols="30" required></textarea>
Author:
${selectAuthor}
<button type="submit">Add</button>
</form>
<form id="addAuthorForm" method="post" action="/ajax/cites/addAuthor">
  <h2>Add author</h2>
  <label for="author_name">Author:</label>
  <input id="author_name" name="author_name" type="text" placeholder="author name" required>
  <button type="submit">Add</button>
</form>
<button id="btnGetCites" type="button">Get cites</button>`.trim();
      json.js = ['/js/cites.js'];
      json.css = ['/css/cites.css'];
      res.json(json);
    });
  } else {
    res.render('login');
  }
});

app.post('/ajax/cites/get', function (req, res) {
  if (req.signedCookies.session_id) {
    userDB.query(`SELECT text, name FROM cites JOIN author ON cites.author_id = author.id`, function (err, rows) {
      if (err) throw err;
      res.json({status: 'ok', rows: rows});
    });
  } else {
    res.render('login');
  }
});

app.post('/ajax/cites/addCite', upload.array([]), function (req, res) {
  console.log('addCite ' + JSON.stringify(req.body));
  if (req.signedCookies.session_id) {
    userDB.query(`INSERT INTO cites (author_id, text) VALUES (${req.body.author}, "${req.body.cite}")`, function (err, rows) {
      if (err) throw err;
      res.json({status: 'ok', message: 'Cite is successfully added', req: req.body});
    });
  }
  else {
    res.render('login');
  }
});

app.post('/ajax/cites/addAuthor', upload.array([]), function (req, res) {
  if (req.signedCookies.session_id) {
    userDB.query(`INSERT INTO author (name) VALUES ("${req.body.author_name}")`, function (err, rows) {
      if (err) throw err;
      res.json({status: 'ok', message: 'Author is successfully added', req: req.body, rows: rows});
    });
  }
  else {
    res.render('login');
  }
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
