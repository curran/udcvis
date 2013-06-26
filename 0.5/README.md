The Universal Data Cube

Model = set of Backbone classes

Unit of data: DataCube = a pair of JSON files: metadata, data

Integration mechanism: DataCubeCollection

Technologies:

 * Node.js
 * Express
 * Node file system API
 * Git
 * GitHub - as backup and failover server (GH-Pages)

Architecture:

 * One cloud hosted VM
   * running the Node app
     * changing files
       * using an async queue for critical sections (write locking)
   * pushing the files to GitHub from time to time (e.g. every hour)
 

