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
  const bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'));
  // Font Awesome
  const fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    .pipe(gulp.dest('./vendor'));
  // jQuery Easing
  const jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./vendor/jquery-easing'));
  // jQuery
  const jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
  return merge(bootstrap, fontAwesome, jquery, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss") // Only watch SCSS source files, never the CSS output
    .pipe(plumber({
      errorHandler: function(err) {
        console.log('CSS Error:', err.toString());
        this.emit('end');
      }
    }))
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest("./css")) // Output regular CSS
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css")) // Output minified CSS
    .pipe(browserSync.stream()); // Safe to stream CSS changes
}

// JS task
function js() {
  return gulp
    .src('./scripts/resume.js') // Source from scripts directory
    .pipe(plumber({
      errorHandler: function(err) {
        console.log('JS Error:', err.toString());
        this.emit('end');
      }
    }))
    .pipe(gulp.dest('./dist/js')) // Copy original to dist/js
    .pipe(uglify()) // Then minify
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/js')); // Output minified version alongside original
}

// Watch files with clean source/output separation
function watchFiles() {
  // Watch source SCSS files → output to css/
  gulp.watch(["./scss/**/*.scss"], css);
  
  // Watch source JS files in scripts/ → output to dist/js/
  gulp.watch(["./scripts/resume.js"], gulp.series(js, function(done) {
    browserSync.reload();
    done();
  }));
  
  // Rebuild site + PDF when data or template scripts change (with debouncing)
  gulp.watch(["./data/**/*.json", "./scripts/**/*.js"], { delay: 500 }, buildResume);
  
  // Watch HTML files for browser reload (but don't rebuild)
  gulp.watch(["./dist/**/*.html"]).on('change', browserSync.reload);
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
exports.modules = modules;
exports.vendor = vendor;
exports.build = build;
exports.pdf = generatePDF;
exports.buildSite = buildSite;
exports.buildResume = buildResume;
exports.watch = watch;
exports.serve = serve;
exports.default = buildSite;
