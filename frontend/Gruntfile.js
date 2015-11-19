module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		babel: {
			options: {
				presets: ['es2015']
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['js/**/*.es6'],
					dest: 'compiled/',
					ext: ".js"
				}]
			}
		},
		bower: {
			install: {
				options: {
					copy: false
				}
			}
		},
		browserify: {
			'dist/js/app.js': ['compiled/js/app.js']
		}
	});

	grunt.registerTask('default', ['bower:install', 'babel', 'browserify']);
};