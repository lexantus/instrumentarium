let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
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

router.get('/:year/:month/:day', function (req, res) {
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

router.get('/complete', function (req, res) {
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

router.get('/break_complete', function (req, res) {
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

router.get('/long_break_complete', function (req, res) {
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

module.exports = router;
