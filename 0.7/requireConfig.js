/**
 * The configuration file for require.js.
 *
 * This enables the AMD module pattern to be used
 * for both third party libraries and local modules.
 *
 * Curran Kelleher 10/17/2013
 */
(function(){
  require.config({
    paths: {
      jquery: '../lib/jquery',
      underscore: '../lib/underscore',
      backbone: '../lib/backbone',
      d3: '../lib/d3',
      async: '../lib/async',
      codemirror: '../lib/codemirror',
      codemirrorJS: '../lib/codemirrorJS',
      inlet: '../lib/inlet'
    },
    shim: {
      jquery: { exports: '$' },
      underscore: { exports: '_' },
      backbone:{
        deps: ['underscore'],
        exports: 'Backbone'
      },
      d3: { exports: 'd3' },
      async: { exports: 'async' },
      codemirror: {
        exports: 'CodeMirror'
      },
      codemirrorJS: {
        deps: ['codemirror'],
        exports: 'CodeMirror'
      },
      inlet: { exports: 'Inlet' }
    }
  });
})();
