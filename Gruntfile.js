'use strict';

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        config: {
            cwd: 'src/',
            src: '**/Dockerfile',
            dest: 'dist/'
        },
        'string-replace': {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.cwd %>',
                    src: '<%= config.src %>',
                    dest: '<%= config.dest %>',
                }],
                options: {
                    replacements: [{
                        pattern: /<!-- @import (.*?) -->/ig,
                        replacement: function (match, p1) {
                            return grunt.file.read(grunt.config.get('config.cwd') + p1);
                        }
                    }]
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-string-replace');

    // Default task.
    grunt.registerTask('default', ['string-replace']);
};
