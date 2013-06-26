The Universal Data Cube

Overall Concept: A platform for collaborative public data curation and visualization.

Collaboration model similar to OpenStreetMap and Wikipedia.

Visualization framework similar to ManyEyes (reusable components).

Data can be contributed through the visualizations.

UDC Data Model = set of Backbone classes

Unit of data: DataCube = a pair of JSON files: metadata, data

Integration mechanism: DataCubeCollection

Technologies:

 * Node.js
 * Express
 * Node file system API
 * Git
 * GitHub - as backup and failover server (GH-Pages)
 * CoffeeScript
 * Backbone
 * D3

Architecture:

 * One cloud hosted VM
   * running the Node app
     * changing files
       * using an async queue for critical sections (write locking)
   * pushing the files to GitHub from time to time (e.g. every hour)
 
File System Layout

 * users
   * joeschmoe
     * profile.json
     * data
       * dataSetX.csv
       * dataSetX.json
     * code
       * visualizationY
         * coffee
           * main.coffee
           * myModule.coffee
         * js
           * main.js
           * myModule.js
