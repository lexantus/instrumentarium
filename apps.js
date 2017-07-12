function App(name, db, scripts, views, icon) {
  this.name = name;
  this.db = db;
  this.scripts_folder = scripts;
  this.views_folder = views;
  this.icon_folder = icon;
}

var sprintf = require("sprintf-js").sprintf;

exports.getAppDataBySessionId = function(db, session_id, success, fail) {
  var clms = "user_id";
  var tbl = "sessions";
  var wr = "session_id = '" + session_id + "'";
  var qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);
  console.log(qry);

  db.query(qry, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length === 1) {
      clms = "name, db, scripts_folder, views_folder, icon";
      tbl = "user_apps";
      wr = "user_id = " + rows[0].user_id;
      qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);
      console.log(qry);
      db.query(qry, function(err, rows, fields) {
        if (err) throw err;
        var n = rows.length;
        var r;
        var appsData = [];
        for (var i = 0; i < n; i++) {
          r = rows[i];
          appsData.push(new App(r.name, r.db, r.scripts_folder, r.views_folder, r.icon));
        }
        success(appsData);
      });
    } else {
      fail("There is no session_id in database. It was deleted from table.");
    }
  });
};
