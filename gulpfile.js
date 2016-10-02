const gulp = require('gulp')
const replace = require('gulp-replace-task')
const fileinclude = require('gulp-file-include')
const browserSync = require('browser-sync')
const babel = require('gulp-babel')

// Default task to be run with `gulp`
gulp.task('default', () => {
    gulp.watch('src/table-style.css', ['css'])
    gulp.watch(['src/responsive-table.js', '.tmp/table-style.css'], ['js'])
    gulp.watch(['index.html', '*.css', '*.js'], ['browser-sync-reload'])
    gulp.start('browser-sync')
})

gulp.task('css', () => {
	gulp.src('src/table-style.css')
		.pipe(replace({
			patterns: [
				{
					match: /\t/g,
					replacement: '\\t'
				}, {
					match: /\n/g,
					replacement: '\\n'
				}, {
					match: 'max',
					replacement: '${options.breakpoint}'
				}
			]
		}))
		.pipe(gulp.dest('.tmp'))
})

gulp.task('js', () => {
	gulp.src('src/responsive-table.js')
		.pipe(fileinclude())
		.pipe(babel())
    	.pipe(gulp.dest('./docs'))
    	.pipe(browserSync.reload({ stream: true }))
})

// browser-sync task for starting the server.
gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: './docs',
            index: 'index.html'
        },
        notify: false,
        ghostMode: false
    })
})

gulp.task('browser-sync-reload', () => {
    browserSync.reload()
})