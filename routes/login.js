let express = require('express');
let router = express.Router();
let Login = require('../Login');
let secret = require('../secret');
let db = require('../UserDB');

let passport = require('passport');
let GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: secret.github_client_id,
    clientSecret: secret.github_secret,
    callbackURL: `https://localhost/ready`
  },
  function (accessToken, refreshToken, profile, cb) {
    console.log("profile " + JSON.stringify(profile));
    if (profile) {
      return cb(null, profile);
    }
    else {
      return cb(null, false);
    }
    /*User.findOrCreate({githubId: profile.id}, function (err, user) {
      return cb(err, user);
    });*/
  }
));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function (req, res) {
  console.log('req.user = ' + req.user);
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

router.get('/auth/github', passport.authenticate('github'));

router.get('/ready',
  passport.authenticate('github', {failureRedirect: '/login'}),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/getGithubUser', function (req, res) {
  res.send(`Access token ${req.query.access_token} Refresh token ${req.query.refresh_token}`);
});

let applications = require('../apps');

router.post('/api/login', function (req, res) {
  Login.execute(db, req, res, function (user) {
    if (user) {
      applications.getAppDataBySessionId(db, user.session_id, function (apps) {
        res.cookie('session_id', user.session_id, {signed: true});
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