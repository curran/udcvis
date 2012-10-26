## Example Applications

 * [Hello Modules](./examples/helloModules) - 10/16/2012 - Shows how 
   an application can be set up that uses libraries and modules via
   Require.js. This is designed to be a template for future examples.
    * `modules/requireJSConfig.js` configures Require.js to look for modules 
      in the right place:
        * Third party libs are `require('lib/libName')`
          * Except for underscore and jQuery, which are just their names.
          * This is because the RequireJS + JQuery bundle is being used,
            and underscore was not working with `require('lib/underscore')`.
        * UDCViS modules are `require('udcvis/moduleName')`
    * This configuration can be re-used by many examples.
 * [SPARQL Example](./examples/SPARQLExample)
 * [Resize Canvas Example](./examples/resizeCanvas)
