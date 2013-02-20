var require = {
  // This base URL permits definition of app-local
  // modules in the 'scripts' directory.
  baseUrl: 'scripts',
  // These libraries are made available as
  // modules to every application.
  paths: {
    'underscore':   '../../../modules/lib/underscore',
    'backbone':     '../../../modules/lib/backbone',
    'async':        '../../../modules/lib/async',
    'backbone':     '../../../modules/lib/backbone',
    'coffee-script':'../../../modules/lib/coffee-script',
    'coffeecup':    '../../../modules/lib/coffeecup',
    'collections':  '../../../modules/lib/collections',
    'gl-matrix':    '../../../modules/lib/gl-matrix',
    'impress':      '../../../modules/lib/impress',
    'marked':       '../../../modules/lib/marked'
  },
  urlArgs: "cacheBust=" +  (new Date()).getTime()
};
