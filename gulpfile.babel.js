'use strict'
/*
 *
 *  Table of Contents
 *  1. Dependencies
 *  2. General Tasks
 *  3. Script Tasks
 *  4. Style Tasks
 *  5. Watch
 *  6. Build
 *  7.
 *
 */

/*
 * 1. Dependencies
 */

// A. General
import gulp         from 'gulp'
import concat       from 'gulp-concat'
import flatten      from 'gulp-flatten'
import gulpif       from 'gulp-if'
import lazypipe     from 'lazypipe'
import merge        from 'merge-stream'
import plumber      from 'gulp-plumber'
import rev          from 'gulp-rev'
import runSequence  from 'run-sequence'
import buffer       from 'vinyl-buffer'
import source       from 'vinyl-source-stream'
import transform    from 'vinyl-transform'
import sourcemaps   from 'gulp-sourcemaps'
import del          from 'del'
import fs           from 'fs'
import rename       from 'gulp-rename'
import uglify       from 'gulp-uglify'
import changed      from 'gulp-changed'

// B. Scripts
import babel        from "gulp-babel"
import browserify   from 'browserify'
import jshint       from 'gulp-jshint'

// C. Styles
import sass         from 'gulp-sass'
import cleanCSS     from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import parker       from 'gulp-parker'
import uncss        from 'gulp-uncss'

// D. Templates
import nunjucks from 'gulp-nunjucks-render'
import data from 'gulp-data'

// E. Images
import imagemin     from 'gulp-imagemin'

// F. Fonts
import fontgen      from 'gulp-fontgen'

// G. Utilities
import browserSync  from 'browser-sync'
var reload = browserSync.reload

/*
 *  2. General Tasks
 */
gulp.task('clean', function() {
 del.sync('./public')
})


/*
 *  3. Script Tasks
 */
gulp.task('scripts', () => {
 var b = browserify({
   entries: './src/assets/scripts/main.js',
   debug: true,
   transform: [
     ["babelify", {presets: ["es2015"]}]
   ]
 })

 return b
   .bundle()
   .pipe(source('main.js'))
   .pipe(buffer())
   .pipe(plumber())
   .pipe(uglify().on('error', function(err){ console.log(err) }))
   .pipe(rename('main.min.js'))
   .pipe(gulp.dest('./public/assets/scripts'))
})

gulp.task('lint', () => {
  return gulp.src('./public/assets/scripts/main.js')
    .pipe(jshint())
})


/*
 *  4. Style Tasks
 */
gulp.task('styles', () => {
  return gulp.src("./src/assets/styles/main.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'ie 8',
        'ie 9',
        'android 2.3',
        'android 4',
        'opera 12'
      ]
    }))
    .pipe(cleanCSS({
      advanced: true,
      mediaMerging: true,
      rebase: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/assets/styles'))
    .pipe(reload({stream: true}))
})

gulp.task('parker', function() {
  return gulp.src('./public/assets/main.css')
    .pipe(parker())
})


/**
 * Template Tasks
 */
gulp.task('templates', () => {

  return gulp.src('src/templates/pages/*.nunjucks')
    .pipe(plumber())
    .pipe(data(getDataForFile))
    .pipe(nunjucks({
      path: 'src/templates'
    }))
    .pipe(gulp.dest('public'))

})

function getDataForFile( file ) {

  let filename = file.relative.split('.')[0]
  var pageData = JSON.parse(fs.readFileSync(`./src/data/${filename}.json`, 'utf8'))

  return Object.assign({
      pageType: filename
    },
    pageData
  )

}


gulp.task('fonts', () => {
  return gulp.src('./src/assets/fonts/*')
    .pipe(fontgen({
      dest: './public/assets/fonts'
    }))
    .pipe(gulp.dest('./public/assets/fonts'))
    .pipe(browserSync.stream())
})

gulp.task('images', () => {
  gulp.src('src/assets/images/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('public/assets/images'))
    .pipe(browserSync.stream())
})

gulp.task('html', () => {
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest('public'))
})

gulp.task('default', () => {
  gulp.start('build')
})



/*
 *  5. Watch
 */
 gulp.task('watch', () => {

   browserSync.init({
     notify: true,
     server: {
       baseDir: './public'
     }
   })

   let source = 'src/assets'
   gulp.watch(source + '/styles/**/*', ['styles'])
   gulp.watch(source + '/scripts/**/*', ['scripts', reload])
   gulp.watch('src/templates/**/*.nunjucks', ['templates', reload])
   gulp.watch(source + '/fonts/**/*', ['fonts'])
   gulp.watch(source + '/images/**/*', ['images'])

 })


/*
 *  5. Build
 */
gulp.task('build', ['clean'], () => {
 runSequence('styles',
             'scripts',
             'templates',
             ['fonts', 'images'])
})
