module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    manifest: grunt.file.readJSON('dist/manifest.json'),
    copy: {
      components: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/angular/',
            src: ['angular.min.js'],
            dest: 'dist/js/'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/css/',
            src: ['bootstrap.min.css'],
            dest: 'dist/css/'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/fonts/',
            src: ['*.woff'],
            dest: 'dist/fonts/'
          }
        ]
      }
    },
    markdown: {
      about: {
        options: { template: '_template.html' },
        files: {
          'dist/templates/about.html': 'README.md'
        }
      }
    },
    crx: {
      release: {
        options: {
          pem: 'WindowResizer.pem'
        },
        files: {
          'WindowResizer.crx': 'dist/',
          '<%= manifest.version %>.crx': 'dist/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-my-crx');

  grunt.registerTask('default', ['copy', 'markdown', 'crx']);
};
