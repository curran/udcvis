## Example Applications

 * [Hello Modules](./examples/helloModules) - 10/16/2012 - Shows how 
   an application can be set up that uses libraries and modules via
   Require.js. This is designed to be a template for future examples.
    * `modules/requireJSConfig.js` configures Require.js to look for modules 
      in the right place:
        * Third party libs are `require('libName')`
        * UDCViS modules are `require('udcvis/moduleName')`
    * This configuration can be re-used by many examples.
