module.exports = function (grunt) {
  'use strict';

  /**
   * read optional JSON from filepath
   * @param {String} filepath
   * @return {Object}
   */
  var readOptionalJSON = function (filepath) {
    var data = {};
    try {
      data = grunt.file.readJSON(filepath);
      // The concatenated file won't pass onevar
      // But our modules can
      delete data.onever;
    } catch (e) { }
    return data;
  };

  grunt.initConfig({
    // package File
    pkg: grunt.file.readJSON('package.json'),

    // bulid source(grunt-build.js).
    build: {
      all: {
        baseUrl: 'src/js',        // base url
        startFile: 'intro.js',    // intro part
        endFile: 'outro.js',      // outro part
        outFile: 'dist/summernote.js' // out file
      }
    },

    // for javascript convention.
    jshint: {
      all: {
        src: [
          'src/js/**/*.js',
          'plugin/**/*.js',
          'lang/**/*.js',
          'Gruntfile.js',
          'test/**/*.js',
          'build/*.js'
        ],
        options: {
          jshintrc: true
        }
      },
      dist: {
        src: 'dist/summernote.js',
        options: readOptionalJSON('.jshintrc')
      }
    },

    // qunit: javascript unit test.
    qunit: {
      all: [ 'test/*.html' ]
    },

    // uglify: minify javascript
    uglify: {
      all: {
        files: { 'dist/summernote.min.js': ['dist/summernote.js'] }
      }
    },

    sass: {
      dist: {
        files: {
          'dist/summernote.css': 'src/sass/summernote.scss',
          'dist/summernote-bs3.css': 'src/sass/summernote-bs3.scss'
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/summernote.min.css': ['dist/summernote-bs3.css', 'dist/summernote.css']
        }
      }
    },

    // compress: summernote-{{version}}-dist.zip
    compress: {
      main: {
        options: {
          archive: function () {
            return 'dist/summernote-{{version}}-dist.zip'.replace(
              '{{version}}',
              grunt.config('pkg.version')
            );
          }
        },
        files: [{
          expand: true,
          src: [
            'dist/*.js',
            'dist/summernote.css',
            'dist/summernote-bs3.css'
          ]
        }]
      }
    },

    // connect configuration.
    connect: {
      all: {
        options: {
          port: 3000,
          livereload: true,
          middleware: function (connect, options, middlewares) {
            var base = options.base[0];
            middlewares = middlewares || [];
            return middlewares.concat([
              require('connect-livereload')(), // livereload middleware
              connect['static'](base),    // serve static files
              connect.directory(base)  // make empty directories browsable
            ]);
          },
          open: 'http://localhost:3000'
        }
      }
    },

    // watch source code change
    watch: {
      all: {
        files: ['src/js/**/*.js', 'src/sass/*.scss'],
        tasks: ['sass', 'cssmin'],//, 'qunit'],
        options: {
          livereload: true
        }
      }
    },

    // Meteor commands to test and publish package
    exec: {
      'meteor-test': {
        command: 'meteor/runtests.sh'
      },
      'meteor-publish': {
        command: 'meteor/publish.sh'
      }
    }

  });

  // load all tasks from the grunt plugins used in this file
  require('load-grunt-tasks')(grunt);

  // load all grunts/*.js
  grunt.loadTasks('grunts');

  // server: runt server for development
  grunt.registerTask('server', ['connect', 'watch']);

  // test: unit test on test folder
  grunt.registerTask('test', ['qunit']);

  // dist: make dist files
  grunt.registerTask('dist', ['build', 'test', 'uglify', 'sass', 'cssmin']);


  // deploy: compress dist files
  grunt.registerTask('deploy', ['dist', 'compress']);

  // default: server
  grunt.registerTask('default', ['server']);

  // Meteor tasks
  grunt.registerTask('meteor-test', 'exec:meteor-test');
  grunt.registerTask('meteor-publish', 'exec:meteor-publish');
  grunt.registerTask('meteor', ['meteor-test', 'meteor-publish']);

};
