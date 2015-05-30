// ============================================================
//   $ npm install --save-dev gulp-util node-notifier gulp vinyl-source-stream vinyl-buffer gulp-uglify gulp-sourcemaps gulp-livereload browserify watchify babelify gulp-ruby-sass gulp-autoprefixer gulp-rename
// ============================================================

function Workflow() {
    // Override workflow settings here

    // Example:
    // this.output.directory = 'public_html';
    // this.watch.script = '**/*.ts';

    this.watch.build = 'content/**/*.md';

    this.watch.style = this.input.directory + '/' + this.input.style.replace(/.+?\.(.+)$/, '**/*.$1');
}

// ============================================================
// ============================================================

Workflow.prototype.output = {
    directory: '.',     // Default output directory. Override with [this.output.directory]
    script: 'scripts.js', // Default output script. Override with [this.output.script]
    style: 'styles.css'  // Default output stylesheet. Override with [this.output.style]
};
Workflow.prototype.input = {
    directory: '.',     // Default input directory root. Override with [this.input.directory]
    script: 'script/app.js', // Default main script file. Override with [this.input.script]
    style: 'style/app.scss' // Default main stylesheet file. Override with [this.input.style]
};
Workflow.prototype.watch = {
    // Key/value pairs for watching files and running tasks. Key is task name, value is glob to watch.
};

var workflow = new Workflow();

var production = process.argv.indexOf('--production') !== -1;

// ------------------------------------------------------------
//     Imports
// ------------------------------------------------------------
var utilities = require('gulp-util');
var notifier = require('node-notifier');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var markdown = require('gulp-markdown');
var highlight = require('gulp-highlight');
var replace = require('gulp-replace');
var entities = require('gulp-html-entities');
// ------------------------------------------------------------
//     Console
// ------------------------------------------------------------

var Console = {};

Console.notify = function (options) {
    options.title = options.title || 'Done';
    options.message = options.message || 'Check your terminal!';
    options.sound = options.sound || 'Pop';
    options.icon = options.icon || 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-bell-128.png';

    notifier.notify(options);
}

Console.notifyOptimistic = function (options) {
    options.contentImage = options.contentImage || 'https://www.secureauth.com/SecureAuth/media/Product/check-mark-11-512_4.png';

    Console.notify(options);
}

Console.notifyPessimistic = function (options) {
    options.contentImage = options.contentImage || 'https://cdn4.iconfinder.com/data/icons/simplicio/128x128/notification_error.png';

    Console.notify(options);
}

Console.log = function () {
    utilities.log.apply(utilities, arguments);

    var args = [];

    for (var i = 0; i < arguments.length; i++) {

        args.push(arguments[i]);
    }

    Console.notifyOptimistic({
        message: args.join(' ')
    });
}

Console.error = function (error) {
    utilities.log.call(utilities, utilities.colors.red(error));

    Console.notifyPessimistic({
        title: error.name,
        message: error.message
    });

    this.emit('end');
}

// ------------------------------------------------------------
//     Script task
// ------------------------------------------------------------

var bundler = browserify({
    entries: ['./' + workflow.input.directory + '/' + workflow.input.script],
    debug: true,
    transform: [[babelify, {global: true}]],
    cache: {},
    packageCache: {}
});

function bundle() {
    var pipe = bundler.bundle()
        .on('error', Console.error)
        .pipe(source(workflow.output.script))
        .pipe(buffer());

    if (production) {

        pipe.pipe(uglify())
            .on('error', Console.error);

    } else {

        pipe.pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write());
    }
    return pipe
        .pipe(gulp.dest(workflow.output.directory))
        .pipe(livereload());
}

function watchBundle() {
    bundler = watchify(bundler);

    bundler.on('update', bundle);
    bundler.on('log', Console.log);

    return bundle();
}

gulp.task('script', bundle);
gulp.task('watchScript', watchBundle);

// ------------------------------------------------------------
//     Style task
// ------------------------------------------------------------

var sassOptions = {
    style: (production) ? 'compressed' : 'expanded',
    sourcemap: !production,
    require: 'sass-globbing'
}

gulp.task('style', function () {
    var pipe = sass(workflow.input.directory + '/' + workflow.input.style, sassOptions)
        .on('error', Console.error)
        .pipe(autoprefixer({map: {inline: true}}));

    if (!production) {
        pipe.pipe(sourcemaps.write());
    }

    pipe.pipe(rename(workflow.output.style))
        .pipe(gulp.dest(workflow.output.directory))
        .pipe(livereload())
});

// ------------------------------------------------------------
//     Watch task
// ------------------------------------------------------------

gulp.task('watch', ['style', 'watchScript', 'build'], function () {
    livereload.listen();

    var watches = workflow.watch;

    for (var task in watches) {

        var glob = watches[task];

        if (task == 'update') {

            gulp.watch(glob, livereload.changed);

        } else {

            gulp.watch(glob, [task]);
        }
    }
});

// ------------------------------------------------------------
//     Default task
// ------------------------------------------------------------

gulp.task('default', ['script', 'style', 'build']);

// ------------------------------------------------------------
//     Build task
// ------------------------------------------------------------

var tap = require('gulp-tap');
var path = require('path');
var spawn = require('child_process').execSync;

gulp.task('build', function () {
    return gulp.src('content/**/*.md')
        .pipe(markdown())
        //.pipe(entities('decode'))
        .pipe(replace(/^/, '<html><head></head><body>'))
        .pipe(replace(/$/, '<script src="/google-code-prettify/prettify.js"></script><script src="/google-code-prettify/lang-dart.js"><script src="/google-code-prettify/lang-css.js"></script><script src="/google-code-prettify/lang-yaml.js"></script><script>prettyPrint()</script></body></html>'))
        .pipe(replace(/class="lang-(\w+)"/g, 'class="prettyprint lang-$1" data-lang="$1"'))
        //.pipe(entities('encode'))
        .pipe(gulp.dest('.build'))
        .pipe(tap(function (file) {
            file.contents = new Buffer(spawn('phantomjs pretty-print-phantom.js ' + path.relative(process.cwd(), file.path.toString()).replace(/^content/, '.build')));
            return file;
        }))
        .pipe(gulp.dest('.build'))
        .pipe(livereload())
});