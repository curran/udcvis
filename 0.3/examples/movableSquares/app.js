// A simple app that lets the user create, move, and delete
// black rectangles. Ths purpose of writing this was to
// learn how to use Backbone Collections.
//
// Curran 3/10/2013
require(['app/model', 'app/view', 'app/controller',
         'app/Node'],
    function(model, view, controller, Node){

  model.nodes.add(new Node({
    x: 50,
    y: 50,
    w: 100,
    h: 100
  }));

});
