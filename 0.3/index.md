# UDCViS v0.3
##### The Universal Data Cube Visualization System<br>Curran Kelleher - February 2012

<center>Licensed under [LGPLV3](http://www.gnu.org/licenses/lgpl.html)</center>

## Design

Version 0.3 will follow these design decisions:

 * There is no server-side software, only files hosted on the Web
   * using [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for cross-domain support
 * [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) will be leveraged for code modularity
   * using [Require.js](http://requirejs.org/)
 * SPARQL will be leveraged to compute query results in the client
   * Using [rdfstore-js](https://github.com/antoniogarrote/rdfstore-js).
 * An in-memory UDC model will be traversed to generate interactive visualizations.

## Table of Contents

 * Modules
   * [lib](https://github.com/curran/udcvis/tree/gh-pages/0.3/modules/lib) - A collection of third party libraries made availavle to examples and applications via [requireJSConfig.js](https://github.com/curran/udcvis/blob/gh-pages/0.3/examples/requireJSConfig.js).
   * [udc](https://github.com/curran/udcvis/tree/gh-pages/0.3/modules/udc) - Reusable modules, documented using YUIDoc in the [apiDocs](http://curran.github.com/udcvis/0.3/apidocs/).
     * [Rectangle](http://curran.github.com/udcvis/0.3/apidocs/classes/Rectangle.html) - A 2D rectangle type.
     * [Interval](http://curran.github.com/udcvis/0.3/apidocs/classes/Interval.html) - A 1D interval type.
 * [Unit Tests](https://github.com/curran/udcvis/tree/gh-pages/0.3/test/spec)
 * [Examples](https://github.com/curran/udcvis/tree/gh-pages/0.3/examples)
   * [csvBarChart](../examples/csvBarChart/app.html) - A bare bones bar chart from CSV data.
   * [csvParallelCoords](../examples/csvParallelCoords/app.html) - A bare bones bar chart from CSV data.
   * [csvPieChart](../examples/csvPieChart/app.html) - A bare bones bar chart from CSV data.
   * [csvScatterPlot](../examples/csvScatterPlot/app.html) - A bare bones scatterplot from CSV data.
   * [geoNamesCrawler](../examples/geoNamesCrawler/app.html) - Crawls [GeoNames](http://www.geonames.org/) to derive a 3-level tree of geographic regions on Earth.
   * [HelloModules](../examples/helloModules/app.js) - An example of how a combination of libraries and local modules can be required using Require.js.
   * [HelloSPARQL](../examples/helloSPARQL) - An example of client-side SPARQL evaluation.
   * [UdcOutliner](../examples/udcOutliner) - Generates an HTML outline from UDC metadata.
