var express = require('express');

var app = express();

app.get('/', function(req, res){
    res.send('instrumentarium.club test page');
});

app.listen(80, '188.127.251.91');