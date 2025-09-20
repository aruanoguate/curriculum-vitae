"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require('sass-embedded'));
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'));
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    .pipe(gulp.dest('./vendor'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./vendor/jquery-easing'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
  return merge(bootstrap, fontAwesome, jquery, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
}

// Watch files
function watchFiles() {
  // Watch only source SCSS files
  gulp.watch(["./scss/**/*.scss"], css);
  // Watch only non-minified JS to avoid infinite loop when writing *.min.js
  gulp.watch(["./js/*.js", "!./js/*.min.js"], js);
  // Rebuild site + PDF when data or template scripts change
  gulp.watch(["./data/**/*.json", "./scripts/**/*.js"], buildResume);
}

// BrowserSync Server
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    port: 8000,
    open: false
  });
  cb();
}

// PDF generation task
async function generatePDF() {
  console.log('🚀 Generating ATS-optimized resume PDF...');
  try {
    const { stdout, stderr } = await execAsync('node scripts/generate-pdf.js');
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ PDF generation completed successfully!');
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
}

// Build resume from unified data source (website + PDF) with single-flight guard to prevent overlap
let buildInFlight = false;
let pendingBuild = false;
async function buildResume() {
  if (buildInFlight) {
    // Coalesce multiple rapid triggers into a single follow-up build
    pendingBuild = true;
    return;
  }
  buildInFlight = true;
  console.log('🏗️ Building complete resume from unified data source...');
  try {
    const { stdout, stderr } = await execAsync('node scripts/build-resume.js');
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Resume build completed successfully!');
    browserSync.reload();
  } catch (error) {
    console.error('❌ Resume build failed:', error);
  } finally {
    buildInFlight = false;
    if (pendingBuild) {
      pendingBuild = false;
      // Schedule next build after small delay to batch further rapid changes
      setTimeout(() => buildResume(), 100);
    }
  }
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js));
const buildSite = gulp.series(vendor, gulp.parallel(css, js), buildResume);
const watch = gulp.series(build, watchFiles);
const serve = gulp.series(buildSite, browserSyncServe, watchFiles);

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.pdf = generatePDF;
exports.buildSite = buildSite;
exports.buildResume = buildResume;
exports.watch = watch;
exports.serve = serve;
exports.default = buildSite;
