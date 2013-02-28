define([], function(){
  // The "base class" that doesn't do anything
  // except provide a base interface for Components.
  function Component(){
    this.isDirty = true;
  }
  var proto = Component.prototype;

  proto.shouldDraw = function(){
    return this.isDirty;
  };

  // Subclasses should implement this
  proto.resize = function(box){
    this.isDirty = true;
  };

  // Subclasses should implement this
  proto.draw = function(canvasContext, box){
  };

  return Component;
});
