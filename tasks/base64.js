
var grunt = require('grunt');

module.exports = function(grunt) {
    // 1: task name
    // 2: description
    // 3: function
    
    grunt.registerTask('base64', 'compile image to base64', function() {
        var assets = {};
        
        // コンテンツそれぞれを検索
        grunt.file.recurse('images', function(abspath, rootdir, subdir, filename) {
          var key = filename.split('.')[0];
          var ext = filename.split('.')[1];
          
          if (ext === 'png') {
          	var key = "img_" + key;
            var data = "data:image/" + ext + ";base64," + grunt.file.read(abspath, {
              encoding: null,
            }).toString('base64');

          	assets[key] = {
          		path: data,
          		type: 'png'
          	};
          }
        });

        // grunt.file.recurse('sounds', function(abspath, rootdir, subdir, filename) {
        //   var key = filename.split('.')[0];
        //   var ext = filename.split('.')[1];
          
        //   if (ext === 'wav') {
        //   	var key = key;
        //     var value = "data:audio/" + ext + ";base64," + grunt.file.read(abspath, {
        //       encoding: null,
        //     }).toString('base64');

        //   	assets[key] = value;
        //   }
        // });
        
        grunt.file.write('build/assets.json', JSON.stringify(assets, null, '    '));
    });
};

