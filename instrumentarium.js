let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let multer = require('multer');
let cookieParser = require('cookie-parser');
let credentials = require('./credentials');
let mysql = require('mysql');
let handlebars = require('express-handlebars').create({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'main')
});

let app = express();
let upload = multer();

let Login = require('./Login');
let UserDB = require('./UserDB');

let userDB = mysql.createConnection(UserDB.get());
userDB.connect();

let applications = require('./apps');

app.engine('handlebars', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.set('x-powered-by', false);

app.use(function (req, res, next) {
  console.log("[Always middleware execution] req is ", req.url);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser(credentials.cookieSecret, {
  maxAge: 20000,
  secure: true,
  httpOnly: true,
  signed: true
}));

app.use(function (req, res, next) {
  if (req.signedCookies.session_id || req.url === '/api/login') {
    console.log("[LOGIN MIDDLEWARE] req.url " + req.url + " session_id " + req.signedCookies.session_id);
    next();
  }
  else {
    app.locals.styles = '<link rel="stylesheet" href="/css/login.css">';
    res.render('login', {
      header: "Войдите"
    });
  }
});

app.get('/', function (req, res) {
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
});

app.get('/ajax/pomodoro', function (req, res) {
  let json = {
    status: 'ok',
    name: 'pomodoro',
    html: `
<div id="pomodoro" class="screen">
    <div id="clock">00:00</div>
    <div id="work" class="icon">start</div>
    <div id="short_break" class="icon">short break</div>
    <div id="long_break" class="icon">long break</div>
    <div id="result"></div>
</div>`.trim(),
    js: ['/js/pomodoro.js'],
    css: ['/css/pomodoro.css']
  };
  res.json(json);
});

app.get('/ajax/pomodoro/:year/:month/:day', function (req, res) {
  let day = req.params.day,
    month = +req.params.month + 1,
    year = req.params.year;

  let q = `select type, time from pomodoro where DATE(time)='${year}-${month}-${day}' AND session_id LIKE "${req.signedCookies.session_id}"`;
  console.log(q);
  userDB.query(q, function (err, rows) {
    if (err) throw err;
    res.json({status: 'ok', rows: rows});
  });
});

app.get('/ajax/pomodoro/complete', function (req, res) {
  let t = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let q = 'INSERT INTO pomodoro (type, time, session_id) VALUES ("0", "' + t + '", "' + req.signedCookies.session_id + '")';
  userDB.query(q, function (err) {
    if (err) throw err;
    res.json({
      status: 'ok',
      message: 'Good work!'
    });
  });
});

app.get('/ajax/pomodoro/break_complete', function (req, res) {
  let t = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let q = 'INSERT INTO pomodoro (type, time, session_id) VALUES ("1", "' + t + '", "' + req.signedCookies.session_id + '")';
  userDB.query(q, function (err) {
    let json = {
      status: 'ok',
      message: 'Break complete!'
    };
    res.json(json);
  });
});

app.get('/ajax/pomodoro/long_break_complete', function (req, res) {
  let t = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let session_id = req.signedCookies.session_id;
  userDB.query(`insert into pomodoro (type, time, session_id) values ("2", "${t}", "${session_id}")`,
    function (err) {
      let json = {
        status: 'ok',
        message: 'Long break complete'
      };
      res.json(json);
    });
});

app.get('/ajax/cites', function (req, res) {
  userDB.query('SELECT * FROM author', function (err, results) {
    let selectAuthor = '<select name="author" id="author"><option value="-1" selected>-</option>';
    let n = results.length;
    for (let i = 0; i < n; i++) {
      selectAuthor += `<option value="${results[i].id}">${results[i].name}</option>`;
    }
    selectAuthor += '</select>';

    let json = {};
    json.status = 'ok';
    json.name = 'cites';
    json.html = `
<div id="cites" class="screen">
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
    <button id="btnGetCites" type="button">Get cites</button>
</div>`.trim();
    json.js = ['/js/cites.js'];
    json.css = ['/css/cites.css'];
    res.json(json);
  });
});

app.post('/ajax/cites/get', function (req, res) {
  userDB.query(`SELECT text, name FROM cites JOIN author ON cites.author_id = author.id`, function (err, rows) {
    if (err) throw err;
    res.json({status: 'ok', rows: rows});
  });
});

app.post('/ajax/cites/addCite', upload.array([]), function (req, res) {
  userDB.query(`INSERT INTO cites (author_id, text) VALUES (${req.body.author}, "${req.body.cite}")`, function (err, rows) {
    if (err) throw err;
    res.json({status: 'ok', message: 'Cite is successfully added', req: req.body});
  });
});

app.post('/ajax/cites/addAuthor', upload.array([]), function (req, res) {
  userDB.query(`INSERT INTO author (name) VALUES ("${req.body.author_name}")`, function (err, rows) {
    if (err) throw err;
    res.json({status: 'ok', message: 'Author is successfully added', req: req.body, rows: rows});
  });
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

//app.listen(80, '188.127.251.91');
module.exports = app;
