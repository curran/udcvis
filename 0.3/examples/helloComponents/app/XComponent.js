define(['app/Component'], function(Component){

  // An "XComponent" draws an X.
  // Inherits from Component.

  var superConstructor = Component,
      proto = new superConstructor(),
      parent = superConstructor.prototype;
  function XComponent(){
    superConstructor.call(this);
  }
  XComponent.prototype = proto;

  proto.draw = function(c, box){
    c.fillStyle = 'black';
    drawX(c, box);
    this.isDirty = false;
  };

  function drawX(c, b){
    drawLine(c, b.x1, b.y1, b.x2, b.y2);
    drawLine(c, b.x1, b.y2, b.x2, b.y1);
  }

  function drawLine(c, x1, y1, x2, y2){
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }
  return XComponent;
});
