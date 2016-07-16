var gulp                = require( 'gulp' ),
    rename              = require( 'gulp-rename' ),
    sass                = require( 'gulp-sass' ),
    minifyCss           = require( 'gulp-minify-css' ),
    uglify              = require( 'gulp-uglify' ),
    jshint              = require( 'gulp-jshint' ),
    concat              = require( 'gulp-concat' ),
    include             = require( "gulp-include" ),
    fileinclude         = require( 'gulp-file-include' ),
    insert              = require( 'gulp-insert' ),
    resolveDependencies = require( 'gulp-resolve-dependencies' ),
    replace             = require( 'gulp-replace' ),
    prefix              = require('gulp-autoprefixer'),
    plumber             = require( 'gulp-plumber' );

var nameOfProject = "cubicColorPicker";

// SCSS TASK
gulp.task( 'scss', function() {
  return gulp.src( './src/scss/*.scss' )
    .pipe( sass() )
    .pipe(prefix(['last 2 version', 'safari 5', 'safari 8', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']))
    .pipe( minifyCss() )
    .pipe( gulp.dest( './dist/css/' ) );
});


gulp.task('js', function(){
  return gulp.src('./src/js/**/*.js') // read all of the files that are in script/lib with a .js extension
    .pipe(resolveDependencies({
      pattern: /\* @requires [\s-]*(.*\.js)/g
    }))
        .on('error', function(err) {
            console.log(err.message);
        })
    .pipe(jshint()) // run their contents through jshint
    .pipe(jshint.reporter('default')) // report any findings from jshint
    .pipe(concat( nameOfProject + '.js')) // concatenate all of the file contents into a file titled 'all.js'
    .pipe(fileinclude({
      prefix: '//@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist/js')) // write that file to the dist/js directory
    .pipe(rename( nameOfProject + '.min.js')) // now rename the file in memory to 'all.min.js'
    .pipe(uglify({  // run uglify (for minification) on 'all.min.js'
        output: {
            comments: /^!|\b(copyright|license)\b|@(preserve|license|cc_on)\b/i
        }
    }))
    .pipe(gulp.dest('./dist/js')); // write all.min.js to the dist/js file
});

// WATCH TASK
gulp.task( 'watch', function() {
  gulp.watch( './src/js/**/*.js', [ 'js' ] );
  gulp.watch( './src/scss/**/*.scss', [ 'scss' ] );
});

gulp.task( 'dist', [ 'js', 'scss' ] );
gulp.task( 'default', [ 'watch', 'dist' ] );
