const gulp = require('gulp');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const src = require('gulp-bem-src');

gulp.task('css', () => {
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
      {block: 'login-form', elem: 'submit'}
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

gulp.task('watch', () => {
  gulp.watch('blocks/**/*.css', ['css']);
  gulp.watch('blocks/**/*.js', ['js']);
});

gulp.task('default', ['watch']);
