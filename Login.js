exports.execute = function(userDB, req, res, callback) {
  var clms = 'COUNT(*) AS count';
  var tbl = 'users';
  var wr = 'user.name="' + req.body.login + '" AND password=UNHEX("' + sha1(password) + '")';
  var qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);

  userDB.query(qry, function(err, rows, fields) {
    if (err) throw err;

    if (rows[0].count === 1)
      res.render('start.html', {
        header1: name + ", что сегодня тратил?",
        user_name: name
      });
    callback(user);
    else
      res.status(401).send("Wrong authorization!!!");
  });
};
