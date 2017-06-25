exports.UserDB = {};
UserDB.host = 'localhost';
UserDB.user = 'alex';
UserDB.password = '1';
UserDB.name = 'users';
UserDB.get = function() {
  return {
    host: this.host,
    user: this.user,
    password: this.password,
    database: this.name
  };
};
