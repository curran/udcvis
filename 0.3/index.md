# UDCViS v0.3
##### The Universal Data Cube Visualization System
##### Curran Kelleher - December 2012

Licensed under the GNU Lesser General Public License Version 3 (LGPLV3)](http://www.gnu.org/licenses/lgpl.html), copyright Curran Kelleher 2012-2013.

## Design

Version 0.3 will follow these design decisions:

 * There is no server-side software, only files
   * hosted on the Web
   * using [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for cross-domain support
 * [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) will be leveraged for code modularity
   * using [Require.js](http://requirejs.org/)
 * SPARQL will be leveraged to compute query results in the client
   * Using [rdfstore-js](https://github.com/antoniogarrote/rdfstore-js).

## Envisioned Table of Contents

 * The Universal Data Cube
   * Dimensions
   * Measures
   * Data Sources
     * United Nations
     * World Bank
     * US Census
     * US Bureau of Labor Statistics
     * Centers for Disease Control
     * Eurostat
   * Data Sets
     * UN Population Estimates
     * Millenium Development Goals Indicators
     * BLS Employment
     * CIA World Factbook
     * US Census
 * Modules
   * Visualizations
     * Bar Chart
     * Choropleth Map
   * Quadstream
 * Examples
   * Module Use Examples
