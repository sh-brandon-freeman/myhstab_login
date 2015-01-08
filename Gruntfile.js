module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      server: {
        files: ['app/**/*.js', 'app/**/*.css', 'app/**/*.html'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 3150,
          open: true,
          livereload: true,
          middleware: function (connect, options) {
            var proxyRequest = require('grunt-connect-proxy/lib/utils').proxyRequest;
            return [
              proxyRequest,
              connect.static('app'),
              connect.static('.tmp')
            ];
          }
        },
        proxies: [
          {
            context: ['/local', '/dev'],
            host: "wwwdev.internal.priorityhealth.com",
            https: true,
            port: 443,
            changeOrigin: true,
            rewrite: {
              '^/local': '',
              '^/dev': ''
            }
          },
          {
            context: ['/qa1', '/qa2', '/qa3'],
            host: "wwwtest.internal.priorityhealth.com",
            https: true,
            port: 443,
            changeOrigin: true,
            rewrite: {
              '^/qa1': '',
              '^/qa2': '',
              '^/qa3': ''
            }
          }
        ]
      }
    }
  });

  grunt.registerTask('default', [
    'configureProxies:server',
    'connect:server',
    'watch:server'
  ]);
};
