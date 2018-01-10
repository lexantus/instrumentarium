let express = require('express');
let router = express.Router();
let OAuth2 = require('oauth').OAuth2;
let Login = require('../Login');
let secret = require('../secret');
let db = require('../UserDB');
let github = new OAuth2(secret.github_client_id, secret.github_secret, 'https://github.com/', 'login/oauth/authorize', 'login/oauth/access_token', null);

router.get('/', function (req, res) {
  applications.getAppDataBySessionId(db, req.signedCookies.session_id, function (apps) {
    console.log(apps);
    res.render('apps', {date: new Date().toISOString()});
  }, function (msg) {
    console.log(msg);
    res.render('start');
  });
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.get('/auth/github', function (req, res) {
  res.redirect(303, github.getAuthorizeUrl({
    redirect_uri: `http://${req.headers.host}/ready`,
    scope: 'user,repo,gist'
  }));
});

router.get('/ready', function (req, res) {
  let code = req.query.code;
  github.getOAuthAccessToken(code, {}, function (err, access_token, refresh_token) {
    if (err) throw err;
    res.send(`GITHUB access token is ${access_token}`);
  });
});

let applications = require('../apps');

router.post('/api/login', function (req, res) {
  Login.execute(db, req, res, function (user) {
    if (user) {
      applications.getAppDataBySessionId(db, user.session_id, function (apps) {
        res.cookie('session_id', user.session_id, {
          signed: true
        });
        console.log(apps);
        res.redirect('/');
      }, function (msg) {
        console.log(msg);
        res.redirect('/login');
      });
    } else {
      res.redirect('/login');
    }
  });
});

router.post('/api/signup', function (req, res) {
  res.redirect('/signup');
});

module.exports = router;