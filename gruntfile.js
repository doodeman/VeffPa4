module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            foo: {
                src: [ "src/js/*.js", "src/js/services/*.js", "src/js/directives/*.js", "src/js/controllers/*.js", ],
            },
        },
        concat: {
            dist: {
                src: [ 'src/js/*.js', 'src/js/**/*.js'],
                dest: 'build/concat-proj.js',
            }
        },
        uglify: {
            build: {
                src:    'build/concat-proj.js',
                dest:   'build/evaluation-app.min.js',
            }
        },
        cssmin: {
            combine: {
                files: {
                    'build/css-min.css': ['src/css/**/*.css']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        less: {
          development: {
            options: {
            },
            files: {
                "src/css/result.css": "src/less/myEvalsButton.less"
            }
          },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less', 'karma']);
};