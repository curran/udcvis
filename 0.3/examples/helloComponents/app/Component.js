define([], function(){
  // The "base class" that doesn't do anything
  // except provide a base interface for Components.
  function constructor(){ };

  constructor.prototype = {
    shouldDraw: function(){return true;},
    draw: function(canvasContext, box){},
    resize: function(box){}
  };

  return constructor;
});
