let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let secret = require('./secret');
let forceSSL = require('express-force-ssl');
let handlebars = require('express-handlebars').create({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'main')
});

let login = require('./routes/login.js');
let pomodoro = require('./routes/pomodoro.js');
let cites = require('./routes/cites.js');
let books = require('./routes/books.js');
let cv = require('./routes/cv.js');

let app = express();

app.engine('handlebars', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.set('x-powered-by', false);

app.use(forceSSL);

app.use(function (req, res, next) {
  console.log("[Always middleware execution] req is ", req.url);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser(secret.cookieSecret, {
  maxAge: 20000,
  secure: true,
  httpOnly: true,
  signed: true
}));

app.use('/', login);
app.use('/cv', cv);
app.use('/ajax/pomodoro', pomodoro);
app.use('/ajax/cites', cites);
app.use('/ajax/books', books);

module.exports = app;
