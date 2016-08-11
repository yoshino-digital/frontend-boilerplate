'use strict';

// require modules
// ===============

// npm modules

var browsersync = require('browser-sync');
var concat      = require('gulp-concat');
var cssnano     = require('gulp-cssnano');
var del         = require('del');
var ftp         = require('vinyl-ftp');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var imagemin    = require('gulp-imagemin');
var less        = require('gulp-less');
var merge       = require('merge-stream');
var nunjucks    = require('gulp-nunjucks-html');
var runsequence = require('run-sequence');
var slack       = require('node-slack');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');

// "private" modules

var printError  = require('./bower_components/yoshino-ui-core/src/dev/gulp-helpers.js').printError;

// environment variables / flags
// =============================

var writeSourceMaps = true;
var compressStyles  = false;
var compressImages  = false;
var compressScripts = false;

if (gutil.env.prod === true) {

    // if the environment variable "--prod" is added to any task call,
    // change these flags to "production mode"

    writeSourceMaps = false;
    compressStyles  = true;
    compressImages  = true;
    compressScripts = true;

}

// tasks
// =====

gulp.task('default', function() {

    /**
     *  Default gulp task
     */

    runsequence('clean', ['templates', 'less', 'js', 'copy']);

});

gulp.task('clean', function() {

    /**
     *  Delete all files from ./dist
     */

    return del(['dist/**/*']);

});

gulp.task('less', function() {

    /**
     *  Compile less files with optional compression (cssnano),
     *  auto-prefixer and sourcemaps.
     */

    return gulp.src([
            './src/assets/less/screen.less'
        ])
        .pipe(writeSourceMaps ? gutil.noop() : sourcemaps.init())
            .pipe(less().on('error', printError))
            .pipe(compressStyles ?
                cssnano({
                    autoprefixer : {
                        browsers : ['last 2 versions'],
                        add      : true
                    }
                }) : gutil.noop()
            )
        .pipe(writeSourceMaps ? gutil.noop() : sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/assets/css/'));

});

gulp.task('js', function() {

    /**
     *  Process javascript with optional compression (uglify) and sourcemaps.
     */
    
    var scripts = require('./src/assets/js/yoshino-ui-core.json');
    var libs    = require('./src/assets/js/libs.json');
    
    var yoshinoUiCore = gulp.src(scripts.src)
        .pipe(writeSourceMaps ? gutil.noop() : sourcemaps.init())
            .pipe(concat('yoshino-ui-core.js'))
            .pipe(compressScripts ? uglify().on('error', printError) : gutil.noop())
        .pipe(writeSourceMaps ? gutil.noop() : sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/assets/js/'));

    var jQuery = gulp.src(libs.jQuery)
        .pipe(concat('jquery.js'))
        .pipe(gulp.dest('./dist/assets/js/libs/'));

    var jQueryUiCustom = gulp.src(libs.jQueryUi)
        .pipe(concat('jquery-ui.js'))
        .pipe(gulp.dest('./dist/assets/js/libs/'));
        
    var theme = gulp.src('./src/assets/js/theme.js')
        .pipe(concat('theme.js'))
        .pipe(gulp.dest('./dist/assets/js/')); 

    return merge(yoshinoUiCore, jQuery, jQueryUiCustom, theme);

});

gulp.task('copy', function() {

    /**
     *  Copy other assets from ./src to ./dist (favIcon, fonts, images, ...).
     *  Optional image compression.
     */

    var copyFavicon = gulp.src('./src/assets/img/favicon.ico')
        .pipe(gulp.dest('./dist/'));
        
    var copyFonts = gulp.src([
            '!./src/assets/fonts/**/readme.md',
            './src/assets/fonts/**/*'
        ])
        .pipe(gulp.dest('./dist/assets/fonts/'));
        
    var copyIconFont = gulp.src('./bower_components/yoshino-icons/webfont/**/*')
        .pipe(gulp.dest('./dist/assets/fonts/icons/'));
        
    var copyIconSvgs = gulp.src('./bower_components/yoshino-icons/svg/**/*.svg')
        .pipe(gulp.dest('./dist/assets/img/icons/'));
        
    var copyImages = gulp.src([
            '!./src/assets/img/**/readme.md',
            './src/assets/img/**/*'
        ])
        .pipe(compressImages ? imagemin() : gutil.noop())
        .pipe(gulp.dest('./dist/assets/img/'));

    return merge(copyFavicon, copyFonts, copyImages, copyIconFont, copyIconSvgs);

});

gulp.task('templates', function() {

    /**
     *  Render nunjuck templates to static HTML files.
     *  Additional searchpath for assets to include SVGs with nunjucks.
     */
    
    return gulp.src([
            '!./src/templates/**/layouts/**/*',
            '!./src/templates/partials/**/*',
            './src/templates/**/*.html'
        ])
        .pipe(nunjucks({searchPaths: [
            './src/templates/',
            './src/assets/'
        ]})
        .on('error', printError))
        .pipe(gulp.dest('./dist/'));

});

gulp.task('serve', function() {

    /**
     *  Run a local web server and some watch tasks which trigger a
     *  refresh when files get changed.
     */

    runsequence('clean', ['templates', 'less', 'js', 'copy'], function() {

        gulp.watch('./src/assets/js/**/*.js', ['js']);
        gulp.watch('./src/assets/less/**/*.less', ['less']);
        gulp.watch('./src/templates/**/*', ['templates']);
        gulp.watch('./src/assets/img/**/*', ['copy']);

        browsersync.init({
            server      : './dist/',
            baseDir     : './dist/',
            notify      : false
        });

    });

});

gulp.task('upload', function() {
    
    /**
     *  Upload the production files to the preview-server.
     *  Passwords are stored in a seperate file, excluded from git.
     *  Once the upload is complete, a message gets send to #slack
     *  via a simple webhook.
     */
    
    var credentials  = require('./credentials.json');

    var conn = ftp.create({
        host:           credentials.devServer.hostName,
        user:           credentials.devServer.ftpUser,
        password:       credentials.devServer.ftpPass,
        maxConnections: 10,
        log:            gutil.log
    });

    return gulp.src('./dist/**', {
            base: './dist/',
            buffer: false
        })
        .pipe(conn.dest('html/').on('end', function() {
            
            var slackMsg = new slack(credentials.slackWebhook.updateOnDevserver);
    
            slackMsg.send({
                'text'        : 'Update on ' + credentials.devServer.hostName + ' by *' + credentials.teamMember + '*:',
                'mrkdwn'      : true,
                'attachments' : [{
                    'text'  : credentials.devServer.url          + '\n' +
                              credentials.devServer.htaccessUser + '\n' +
                              credentials.devServer.htaccessPass + '\n',
                    'color' : '#2afd8f'
                }]
            });
            
        }));

});

gulp.task('deploy', function() {

    /**
     *  Run a sequence of tasks in production-mode and call
     *  the upload task at the end of the task chain.
     */

    runsequence('clean', ['templates', 'less', 'js', 'copy'], 'upload');

});