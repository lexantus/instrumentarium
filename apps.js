function App(name, db, scripts, views, icon) {
  this.name = name;
  this.db = db;
  this.scripts_folder = scripts;
  this.views_folder = views;
  this.icon_folder = icon;
}

var sprintf = require("sprintf-js").sprintf;

exports.getAppData = function(db, userId, callback) {
  var appsData = [];

  var clms = 'name, db, scripts_folder, views_folder, icon';
  var tbl = 'user_apps';
  var wr = 'user_id = ' + userId;
  var qry = sprintf('SELECT %s FROM %s WHERE %s', clms, tbl, wr);

  db.query(qry, function(err, rows, fields) {
    if (err) throw err;
    var n = rows.length;
    var r;
    for (var i = 0; i < n; i++) {
      r = rows[i];
      appData[i] = new App(r.name, r.db, r.scripts_folder, r.views_folder, r.icon);
    }
  });
  callback(appsData);
};
