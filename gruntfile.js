module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  var banner = '\
/*\n\
 * do not break <%= version %>\n\
 * MIT Licensed\n\
 * \n\
 * Copyright (C) 2010 phi, http://tmlife.net\n\
 */\n\
';

  var target = [
  	"plugins/tmlib.js",
  	"scripts/piyo.js",
  	"scripts/param.js",
  	"scripts/resultscene.js",
  	"scripts/mainscene.js",
  	"scripts/main.js",
  ];

  grunt.initConfig({
    version: pkg.version,
    buildDir: "build",

    jade: {
    	compile: {
    		options: {
    			pretty: true,
    			data: {
	    			debug: true,
	    			pageTitle: "ブロック崩さぬ",
	    			assets: grunt.file.read('build/assets.json'),
	    			script: grunt.file.read('build/main.js'),
    			}
    		},
    		files: {
    			"build/index.html": "templates/index.jade",
    		}
    	}
    },

    copy: {
      main: {
      	files: [
      	  {expand: true, cwd: 'plugins/', src: ['**'], dest: 'build/'},
      	  {expand: true, cwd: 'images/', src: ['**'], dest: 'build/'},
      	  {expand: true, cwd: 'sounds/', src: ['**'], dest: 'build/'},
      	  {expand: true, cwd: 'scripts/', src: ['**'], dest: 'build/'},
      	]
      }
    },

    concat: {
      tmlib: {
        src: target,
        dest: '<%= buildDir %>/main.js',
        options: {
          banner: banner
        }
      },
    },
    uglify: {
      tmlib: {
        options: {

        },
        files: {
          '<%= buildDir %>/main.min.js': [ '<%= buildDir %>/main.js' ]
        },
      },
    },
    less: {
      tmlib: {
        src: 'css/style.less',
        dest: 'css/style.css',
      }
    },
    shell: {
      docs: {
        command: 'jsduck ./src --output ./docs --title "tmlib.js docs" --eg-iframe=tm-iframe.html',
        options: {
            stdout: true,
            callback: function(err, stdout, stderr, cb) {
              console.log(err);
              console.log(stdout);
              console.log(stderr);
              console.log(cb);
            },
        },
      },
    }
  });

  for (var key in pkg.devDependencies) {
//    if (/grunt-contrib/.test(key)) {
    if (/grunt-/.test(key)) {
      grunt.loadNpmTasks(key);
    }
  }
  grunt.task.loadTasks("tasks");

  grunt.registerTask('default', ['base64', 'concat', 'uglify', 'jade']);
}














