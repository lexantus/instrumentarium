function App(name, db, scripts, views, icon) {
  this.name = name;
  this.db = db;
  this.scripts_folder = scripts;
  this.views_folder = views;
  this.icon_folder = icon;
}

exports.getAppData = function(db, userId) {
  var appsData = [];

  var clms = 'name, db, scripts_folder';
  var tbl = 'user_apps';
  var wr = 'id = ' + userId;
  var qry = sprintf('SELECT %s FROM %s WHERE %s', c, t, w);

  db.query(qry, function(err, rows, fields) {
    if (err) throw err;
    var n = rows.length;
    var r;
    for (var i = 0; i < n; i++) {
      r = rows[i];
      appData[i] = new App(r.name, r.db, r.scripts, r.views, r.icon);
    }
  });
  return appsData;
};
