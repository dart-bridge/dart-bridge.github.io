var gulp = require('gulp');
var markdown = require('gulp-markdown');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var tap = require('gulp-tap');
var path = require('path');
var rmdir = require('rimraf').sync;
var glob = require('glob').sync;
var spawn = require('child_process').execSync;

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function () {
    return gulp.watch('docs/**/*.md', function (file) {
        return buildDocumentationFile(file.path);
    });
});

gulp.task('build', function () {
    rmdir('pages/docs');
    var files = glob('docs/**/*.md');
    for (var i = 0; i < files.length; i++)
        buildDocumentationFile(files[i]);
});

var phantomHeader = '<html><head></head><body>';
var phantomFooter =
    '<script src="/build_task/prettify.js"></script>' +
    '<script src="/build_task/lang-dart.js"></script>' +
    '<script src="/build_task/lang-css.js"></script>' +
    '<script src="/build_task/lang-yaml.js"></script>' +
    '<script src="/build_task/lang-bridge-html.js"></script>' +
    '<script>prettyPrint()</script></body></html>';

function buildDocumentationFile(filename) {
    filename = path.relative(process.cwd(), filename);
    var dir = path.dirname(filename);
    var name = filename.replace(/\//g, '-').replace(/\.md$/, '');
    var destPath = 'pages/' + dir + '/' + name + '.html';
    var destDir = path.dirname(destPath);
    var destFilename = path.basename(destPath);
    return gulp.src(filename)
        .pipe(markdown())
        // <HORRIBLE HORRIBLE HORRIBLE HACKS>
        .pipe(replace(/^/, phantomHeader))
        .pipe(replace(/$/, phantomFooter))
        .pipe(replace(/class="lang-(\w+)"/g, 'class="prettyprint lang-$1" data-lang="$1"'))
        .pipe(rename(destFilename))
        .pipe(gulp.dest(destDir))
        .pipe(tap(function (file) {
            var phantomOut = spawn('phantomjs build_task/pretty-print-phantom.js ' + destPath);

            var cleaned = phantomOut.toString()
                .replace(phantomFooter, '')
                .replace(phantomHeader, '');

            var polymerOutput = '<dom-module id="' + name + '">' +
                '<template><doc-page>' + cleaned + '</doc-page></template>' +
                '<script>Polymer({})</script>' +
                '</dom-module>';

            console.log('Wrote ' + destPath);

            file.contents = new Buffer(polymerOutput);
            return file;
        }))
        .pipe(replace('{{', '{<wbr>{'))
        // </OH THE HORROR>
        .pipe(gulp.dest(destDir));
}