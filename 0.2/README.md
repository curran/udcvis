# The Universal Data Cube Visualization System v0.2

The organizational approach for version 0.2 is as follows:

 * `lib` contains third party libraries
 * `modules` contains UDCViS modules
 * `examples` contains example applications that use those modules
 * `data` contains RDF data used by examples

Require.js is used for scalable modular coding.

## Examples

 * [Hello Modules](./examples/helloModules) - 10/16/2012 - Shows how 
   an application can be set up that uses libraries and modules via
   Require.js. This is designed to be a template for future examples.
    * `modules/requireJSConfig.js` configures Require.js to look for modules 
      in the right place:
        * Third party libs are `require('libName')`
        * UDCViS modules are `require('udcvis/moduleName')`
    * This configuration can be re-used by many examples.

Curran 10/16/2012
