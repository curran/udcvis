var require = {
  // These libraries are made available as
  // modules to every application.
  paths: {
    'udc':          '../../modules/udc',
    'underscore':   '../../modules/lib/underscore',
    'backbone':     '../../modules/lib/backbone',
    'async':        '../../modules/lib/async',
    'backbone':     '../../modules/lib/backbone',
    'coffee-script':'../../modules/lib/coffee-script',
    'coffeecup':    '../../modules/lib/coffeecup',
    'collections':  '../../modules/lib/collections',
    'gl-matrix':    '../../modules/lib/gl-matrix',
    'impress':      '../../modules/lib/impress',
    'marked':       '../../modules/lib/marked',
    'jquery.csv':   '../../modules/lib/jquery.csv',
    'text':         '../../modules/lib/text',
    'requestAnimFrame':'../../modules/lib/requestAnimFrame'
  },
  urlArgs: "cacheBust=" +  (new Date()).getTime()
};
