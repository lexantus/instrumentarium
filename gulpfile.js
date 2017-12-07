const gulp = require('gulp');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const src = require('gulp-bem-src');

gulp.task('css', () => {
  src(
    ['blocks'],
    [{block: 'login-form'}],
    'styles',
    {
      techMap: {
        styles: ['css']
      },
      config: {
        'blocks/login-form': {scheme: 'nested'},
        'blocks': {scheme: 'nested'}
      }
    }
  ).pipe(concat('common.css'))
    .pipe(gulp.dest('bundles'))
    .pipe(debug());
});

gulp.task('js', () => {
  console.log('JS TASK!!!');
});

gulp.task('default', ['css']);
gulp.task('watch', () => {
  gulp.watch('blocks/**/*.css', ['css']);
  gulp.watch('blocks/**/*.js', ['js']);
});