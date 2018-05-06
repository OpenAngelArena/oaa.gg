var gulp       = require('gulp');
var uglify     = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps');
var watch      = require('gulp-watch');

// Define functions that might be watchable
var functionCompileJS = function() {
  return gulp.src('js/sources/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .on('error', function(error) {
          console.log('Unable to compile Javascript.  Please fix syntax errors and resave the file');
          console.error(error.toString());
      })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('js/cache'))
};



/********************/
/* Task definitions */
/********************/

gulp.task('watch', function() {
  return watch('js/sources/**/*.js', {
    ignoreInitial: true,
  }, function(){
    var logTimestamp = new Date();

    console.log('[' + logTimestamp.getHours() + ':' + logTimestamp.getMinutes() + ':' + logTimestamp.getSeconds() + ']' + 'Compiling javascript');

    functionCompileJS();
  });
});

gulp.task('compileJS', functionCompileJS);
