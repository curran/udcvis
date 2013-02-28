define(['app/Component','udc/Rectangle'], 
    function(Component, Rectangle){

  var superConstructor = Component,
      proto = new superConstructor(),
      parent = superConstructor.prototype,
      tempRect = new Rectangle();
  function SquareComponent(child){
    superConstructor.call(this);
    this.child = child;
  }
  SquareComponent.prototype = proto;
  
  proto.draw = function(c, box){
    this.child.draw(c, fit(box));
    this.isDirty = false;
  };
 
  function fit(b){
    var sq = tempRect;
    if(b.w > b.h){
      sq.w = sq.h = b.h;
      sq.x = b.x + b.w/2 - b.h/2;
      sq.y = b.y;
    }
    else{
      sq.w = sq.h = b.w;
      sq.x = b.x;
      sq.y = b.y + b.h/2 - b.w/2;
    }
    return sq;
  }
  return SquareComponent;
});
