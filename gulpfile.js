var gulp = require('gulp')

var npmDir = './npm-supporticon'

var files = [
  './dist/**/*.js',
  '!./dist/**/__tests__/*.js'
]

/**
* Place our files in as they are
*/
gulp.task('npm-prep-files', function() {
  return gulp.src(files)
    .pipe(gulp.dest(npmDir))
})

/**
* Copy over necessary meta files
*/
gulp.task('npm-prep-meta', function() {
  return gulp.src(['README.md', 'package.json'])
    .pipe(gulp.dest(npmDir))
})

/**
* Move markdown files into docsc dir
*/
gulp.task('docs-prepare', function() {
  return gulp.src([
    './source/**/*.md',
    './docs/README.md',
    './docs/index.html',
    './docs/.nojekyll'
  ])
    .pipe(gulp.dest('./styleguide'))
})

gulp.task('npm-prepare', gulp.series(
  'npm-prep-files',
  'npm-prep-meta'
))
