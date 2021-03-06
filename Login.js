var sha1 = require('sha1');
var sprintf = require("sprintf-js").sprintf;
const UUID = require('uuid/v1');

exports.execute = function (db, req, res, callback) {
  var clms = 'id';
  var tbl = 'users';
  console.log('form ' + JSON.stringify(req.body));
  var wr = 'name="' + req.body.login + '" AND password=UNHEX("' + sha1(req.body.password) + '")';
  var qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);
  console.log(qry);

  db.query(qry, function (err, rows, fields) {
    var user_id;
    var session_id;

    if (err) throw err;

    if (rows.length === 1) {
      user_id = rows[0].id;
      clms = 'session_id';
      tbl = 'sessions';
      wr = 'user_id=' + user_id;
      qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);
      console.log(qry);

      db.query(qry, function (err, rows, fields) {
        if (err) throw err;

        if (rows.length === 0) {
          clms = 'session_id, user_id';
          session_id = UUID();
          values = "'" + session_id + "'," + user_id;
          qry = sprintf('INSERT INTO %s (%s) VALUES (%s)', tbl, clms, values);
          console.log(qry);
          db.query(qry, function (err, rows, fields) {
            if (err) throw err;
            callback({
              session_id: session_id
            });
          });
        } else {
          session_id = rows[0].session_id;
          callback({
            session_id: session_id
          });
        }
      });
    } else {
      callback();
    }
  });
};
