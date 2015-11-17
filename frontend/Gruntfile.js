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
					cwd: 'src/js/',
					src: ['*.js'],
					dest: 'dist/js/'
				}]
			}
		},
		bower: {
			install: {
				options: {
					copy: false
				}
			}
		}
	});

	grunt.registerTask('default', ['bower:install','babel']);
};