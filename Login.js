var sha1 = require('sha1');
var sprintf = require("sprintf-js").sprintf;

exports.execute = function(userDB, req, res, callback) {
  var clms = 'id, COUNT(*) AS count';
  var tbl = 'users';
  var wr = 'name="' + req.body.login + '" AND password=UNHEX("' + sha1(req.body.password) + '")';
  var qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);

  userDB.query(qry, function(err, rows, fields) {
    if (err) throw err;

    if (rows[0].count === 1) {
      user = {
        id: rows[0].id
      };
      callback(user);
    } else {
      res.end("Wrong authorization!!!");
      callback(undefined);
    }
  });
};
