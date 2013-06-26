module.exports = function(grunt) {
  grunt.initConfig({
    coffee: {
      glob_to_multiple: {
        expand: true,
        flatten: true,
        cwd: 'coffee',
        src: ['*.coffee'],
        dest: 'js',
        ext: '.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('default', ['coffee']);

};
