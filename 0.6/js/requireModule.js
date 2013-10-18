/**
 * This module provides a module loader for use by
 * applications in dynamically loading modules that
 * create components. This loader looks for modules
 * in the `modules` directory. See also `app.js`.
 *
 * Curran Kelleher 10/17/2013
 */
define([], function () {
  return function (moduleName, callback) {
    require(['../modules/' + moduleName], callback);
  }
});
