// The top-level script for the Quadstream World Map application.
//
// <small>By Curran Kelleher, December 2012</small>
//
// The main components of the app are:
//
//  * [Model](./model.html) - The state model of the application.
//  * [View](./view.html) - Responsible for rendering the model.
//  * [Controller](./controller.html) - Responsible for defining user interactions.
require(['model', 'view', 'controller', 
         'renderLoop', 'geoJSONLoader', 'underscore', 
         'quadstream/preprocess', 
         'quadstream/buildTree',
         'quadstream/partitionFiles'],function(
    model, view, controller, renderLoop, geoJSONLoader, _,
    preprocess, buildTree, partitionFiles){
  // ## Initialization

  //  * Load the geoJSON file using 
  // the [geoJSONLoader](./geoJSONLoader.html) module.
  var fileName = '../../Quadstream/data/ne_10m_admin_0_countries.json';
  geoJSONLoader.loadPolygons(fileName, function(err, polygons){
    var maxDepth = 8,
        fileDepth = 2,
        vertices = preprocess(polygons),
        vertexBounds = vertices.bounds,
        nodes = buildTree(vertices, maxDepth),
        files = partitionFiles(nodes, fileDepth);

    model.setVertexBounds(vertexBounds);

    _(_(files).keys()).each(function(key){
      var file = files[key];
      //console.log(key+" "+file.length);
      //console.log(file);
      model.loadFile(key, file);

    });
  });

  //  * Define and start the rendering loop.
  renderLoop.addFrameSteps([
    controller.executeFrame,
    view.executeFrame
  ]);

  renderLoop.start();

});
