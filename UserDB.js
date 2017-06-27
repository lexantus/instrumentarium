UserDB = {};
UserDB.host = 'localhost';
UserDB.user = 'root';
UserDB.password = '1';
UserDB.name = 'users';

exports.get = function() {
  return {
    host: UserDB.host,
    user: UserDB.user,
    password: UserDB.password,
    database: UserDB.name
  };
};
