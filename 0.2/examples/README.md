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
 * [Resize Canvas Example](./examples/resizeCanvas) - 10/26/2012
   * [Run it](http://curran.github.com/udcvis/0.2/examples/resizeCanvasExample/app.html)
   * A demonstration of the modules `requestAnimFrame` and `resizeCanvas`.
 * [SPARQL Example](./examples/SPARQLExample) - 10/26/2012
   * [Run it](http://curran.github.com/udcvis/0.2/examples/SPARQLExample/index.html)
   * Demonstrates querying DBPedia using JQuery and SPARQL and 
     displaying the results using text on a canvas.
 * [Algorithmic Composition](./examples/algorithmicComposition) - 10/27/2012
   * [Run it](http://curran.github.com/udcvis/0.2/examples/algorithmicComposition/index.html)(tested only in Chrome)
   * A demonstration of real-time algorithmic composition and audio
     synthesis with four voices using the Web Audio API.
 * [iPad Drum](./examples/iPadDrum) - 10/27/2012
   * An iPad Webapp that lets you control four octaves of rhythmic sine waves.
   * A demonstration combining the following technologies:
     * iOS Multitouch events
     * Node.js
     * Socket.io (Web Sockets)
     * HTML5 Canvas
     * Web Audio API
   * To run it you need the following setup:
     * an iPad connected to local WiFi
     * a Node.js server connected to local WiFi
     * a Web Browser open on the same machine as the server
     * multi-touch events on the iPad being broadcast through Web Sockets
       to the Web Browser via Node.js
     * Audio synthesis in the Web browser driven by iPad input
       * using the Web Audio API (works in Chrome)
 * [Components Example](./examples/helloComponents) - 10/28/2012
   * [Run it](http://curran.github.com/udcvis/0.2/examples/helloComponents/app.html)
   * A demonstration of the `components` module.
