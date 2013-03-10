define(['app/Component','udc/Rectangle'], 
    function(Component, Rectangle){

  var superConstructor = Component,
      proto = new superConstructor(),
      parent = superConstructor.prototype,
      tempRect = new Rectangle();
  function LinearComponent(orientation){
    superConstructor.call(this);
    this.children = [];
    this.orientation = orientation;
  }
  LinearComponent.prototype = proto;

  // options: size:Number
  proto.addChild = function(component, options){
    this.children.push({
      component: component,
      options: options
    });
    //component.on('dirty', function(){
    //  this.dirty = true;
    //  this.trigger('dirty');
    //}
  }
  
  proto.draw = function(c, box){
    var i, n = this.children.length, child,
        childSize, totalSize = 0, sizeSoFar = 0, 
        p1, p2;

    // Sum sizes
    for(i = 0; i < n; i++){
      child = this.children[i];
      if(!child.options.aspectRatio)
        childSize = child.options.size;
      totalSize += childSize;
    }

    // Handle fixed aspect ratio
    for(i = 0; i < n; i++){
      child = this.children[i];
      if(child.options.aspectRatio){
//        if(this.orientation == 'horizontal'){
//          child.options.size = child.options.aspectRatio - box.h / box.w;
//        }
        childSize = child.options.size;
        totalSize += childSize;
      }
    }

    for(i = 0; i < n; i++){
      child = this.children[i];
      childSize = child.options.size;
      p1 = sizeSoFar / totalSize;
      sizeSoFar += childSize;
      p2 = sizeSoFar / totalSize;

      if(this.orientation == 'horizontal'){
        tempRect.x1 = box.x + box.w * p1;
        tempRect.x2 = box.x + box.w * p2;
        tempRect.y = box.y;
        tempRect.h = box.h;
      }
      else if(this.orientation == 'vertical'){
        tempRect.y1 = box.y + box.h * p1;
        tempRect.y2 = box.y + box.h * p2;
        tempRect.x = box.x;
        tempRect.w = box.w;
      }

      child.component.draw(c, new Rectangle(
        tempRect.x, tempRect.y, tempRect.w, tempRect.h
      ));
//      child.component.draw(c, tempRect);
    }
    this.isDirty = false;
  };

  return LinearComponent;
});
