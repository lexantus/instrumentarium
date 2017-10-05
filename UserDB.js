UserDB = {};
UserDB.host = 'localhost';
UserDB.user = 'root';
UserDB.password = 'movieclip1';
UserDB.name = 'users';

exports.get = function() {
  return {
    host: UserDB.host,
    user: UserDB.user,
    password: UserDB.password,
    database: UserDB.name
  };
};
