const gulp = require('gulp');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const src = require('gulp-bem-src');

gulp.task('login-form', () => {
  src(
    ['blocks'],
    [
      {block: 'login-form'},
      {block: 'login-form', elem: 'a'},
      {block: 'login-form', elem: 'input'},
      {block: 'login-form', elem: 'input', mod: 'icon'},
      {block: 'login-form', elem: 'register'},
      {block: 'login-form', elem: 'separator'},
      {block: 'login-form', elem: 'signin'},
      {block: 'login-form', elem: 'signin', mod: 'social'},
      {block: 'login-form', elem: 'submit'},
      {block: 'top-bar'}
    ],
    'styles',
    {
      techMap: {
        styles: ['css']
      },
      config: {
        'blocks': {scheme: 'nested'}
      }
    }
  ).pipe(concat('login-form.css'))
    .pipe(gulp.dest('bundles'))
    .pipe(gulp.dest('public/css'))
    .pipe(debug());
});

gulp.task('common', () => {
  src(
    ['blocks'],
    [{block: 'top-bar'}],
    'styles',
    {
      techMap: {
        styles: ['css']
      },
      config: {
        'blocks': {scheme: 'nested'}
      }
    }
  ).pipe(concat('common.css'))
    .pipe(gulp.dest('bundles'))
    .pipe(gulp.dest('public/css'))
    .pipe(debug());
});

gulp.task('start', () => {
  src(
    ['blocks'],
    [
      {block: 'banner'},
      {block: 'banner', mod: 'overview'}
    ],
    'styles',
    {
      techMap: {
        styles: ['css']
      },
      config: {
        'blocks': {scheme: 'nested'}
      }
    }
  ).pipe(concat('start.css'))
    .pipe(gulp.dest('bundles'))
    .pipe(gulp.dest('public/css'))
    .pipe(debug());
});

gulp.task('watch', () => {
  gulp.watch(['blocks/**/*.css', 'gulpfile.js'], ['login-form', 'common', 'start']);
  gulp.watch('blocks/**/*.js', ['js']);
});

gulp.task('default', ['watch']);
