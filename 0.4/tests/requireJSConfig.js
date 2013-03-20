// This is the configuration file for Require.js.
var require = {
  // This line means Require.js will look to the `js` directory for modules.
  baseUrl: '../js',
  paths: {
    // This line means that module references of the form `spec/myModule`
    // will resolve to modules defined in the `tests/spec` directory.
    //
    // Note the path is relative to `baseUrl`.
    'spec': '../tests/spec',
    'underscore': '../lib/underscore',
    'backbone': '../lib/backbone'
  },

  // This line causes the URL used to fetch modules
  // to be different each time, but still get the right file.
  // It is here so that during development, the source files 
  // are never cached (so the browser always gets the latest version).
  urlArgs: "cacheBust=" +  (new Date()).getTime()
};
