var sha1 = require('sha1');
var sprintf = require("sprintf-js").sprintf;
const UUID = require('uuid/v1');

exports.execute = function(userDB, req, res, callback) {
  var clms = 'id, COUNT(*) AS count';
  var tbl = 'users';
  var wr = 'name="' + req.body.login + '" AND password=UNHEX("' + sha1(req.body.password) + '")';
  var qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);

  userDB.query(qry, function(err, rows, fields) {
    var user_id;
    var session_id;

    if (err) throw err;

    if (rows[0].count === 1) {
      user_id = rows[0].id;
      clms = 'COUNT(*) AS count, session_id';
      tbl = 'sessions';
      wr = 'user_id=' + user_id;
      qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);

      userDB.query(qry, function(err, rows, fields) {
        if (err) throw err;

        if (rows[0].count === 0) {
          clms = 'session_id, user_id';
          session_id = UUID();
          values = session_id + ',' + user_id;
          qry = sprintf('INSERT INTO %s (%s) VALUES (%s)', tbl, clms, values);
        } else {
          session_id = rows[0].session_id;
        }
      });
      user = {
        user_id: user_id,
        session_id: session_id
      };
      callback(user);
    } else {
      res.end("Wrong authorization!!!");
      callback(undefined);
    }
  });
};
