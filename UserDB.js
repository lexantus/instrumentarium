let mysql = require('mysql');
let userDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'movieclip1',
  database: 'users'
});
userDB.connect();

module.exports = userDB;
