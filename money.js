var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var multer = require('multer');
var mysql = require('mysql');
var sha1 = require('sha1');
var mustacheExpress = require('mustache-express');

var app = express();
var upload = multer();

var connection = mysql.createConnection({host: 'localhost', user: 'alex', password: '1', database: 'money'});
connection.connect();

app.use(bodyParser.urlencoded({extended: true}));

app.engine('html', mustacheExpress());
app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');

function login(res, name, password) {
	var where = ' WHERE name="' + name + '" AND password=UNHEX("' + sha1(password) + '")';
	var select = 'SELECT COUNT(*) AS count FROM participants INNER JOIN passwords ON participants.idwho=passwords.idwho';
	var query = select + where;
	console.log(query);
	connection.query(query, function(err, rows, fields){
		if (err) throw err;

        if (name === 'alex')
            name = 'Лёха';

		if (rows[0].count === 1)
			res.render('start.html', {header1: name + ", что сегодня тратил?", user_name: name});
		else
			res.send('Я тебя не знаю. Пшёл нахуй!!!');
	});
}

function spend(res, name, reason, sum) {
    var q = 'INSERT INTO spend (idwho, reason, amount) VALUES ('+ 12 + ',"' + reason + '","' + sum +'")';
    connection.query(q, function(err, result){
        if (err) throw err;
        res.send(result);
    });
    console.log("Add spend with reason = " + reason + " sum = '" + sum + " for userId = " + 12);
}

app.post('/api/login', upload.array(), function(req, res, next) {
	console.log("req body is " + JSON.stringify(req.body));
	login(res, req.body.user_login, req.body.user_password);
});

app.post('/api/spend', upload.array(), function(req, res, next) {
    console.log("req body is " + JSON.stringify(req.body));
    spend(res, req.body.user_name, req.body.reason, req.body.sum);
});

app.listen(8001, '127.0.0.1');
