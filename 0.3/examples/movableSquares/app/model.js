define(['app/Node'], function(Node){
  return {
    nodes: new Backbone.Collection({
      model: Node
    })
  }
});
