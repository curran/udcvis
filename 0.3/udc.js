// This script configures Require.js to look in the
// UDC modules directory for dependencies.
// 
// To use, include this script, then include require.js in your HTML page.
//
// You can then use `require(['foo','bar'], function(foo, bar){ ... })`
// to load and use the following modules by name (in place of 'foo' and 'bar'):
//
var require = {
  baseUrl: 'http://universaldatacube.org/0.3/modules',
  urlArgs: "cacheBust=" + Date.now()
};
