// A ColoredXComponent is an XComponent with
// a background color.
define(['app/XComponent'], function(XComponent){
  var proto = new XComponent(),
      parent = XComponent.prototype,
      superConstructor = XComponent;

  function constructor(color){
    superConstructor.call(this);
    this.color = color;
  }
  constructor.prototype = proto;
  
  proto.draw = function(c, box){
    // Draw the colored boxackground
    c.fillStyle = this.color;
    c.fillRect(box.x, box.y, box.w, box.h);

    // Draw the X in the foreground
    // This call sets this.isDirty = false.
    parent.draw.call(this, c, box);
  };

  return constructor;
});
