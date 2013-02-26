define(['app/Component'], function(Component){

  // An "XComponent" draws an X.
  // Inherits from Component.

  var proto = new Component();
  function constructor(){
    this.isDirty = true;
  }
  constructor.prototype = proto;

  proto.shouldDraw = function(){
    return this.isDirty;
  };
  
  proto.draw = function(c, box){
    c.fillStyle = 'black';
    drawX(c, box);
    this.isDirty = false;
  };

  proto.resize = function(box){
    this.isDirty = true;
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
  return constructor;
});
