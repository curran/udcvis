define(['underscore'], function(_){

  var defaults = {
    x: 0, y: 0, width: 1, height: 1
  };

  var rectanglePrototype = {
    set: function(x, y, width, height){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  };

  function getSet(obj, key){
    return {
      set: function(value){
        obj[key] = value;
      },
      get: function(){
        return obj[key];
      }
    }
  }

  return {
    // `create(options)` Creates a new rectangle object.
    // 
    //  * `options` is an object, or null, with properties:
    //    * `x`, `y` the coordinates
    //      * both are optional and default to 0
    //    * `width`, `height` the dimensions
    //      * both are optional and default to 1
    create:function(options){
      options = options ? options : {};
      var rect = _.defaults(options, defaults);
      return Object.create(rectanglePrototype, {
        x: getSet(rect, 'x'),
        y: getSet(rect, 'y'),
        width: getSet(rect, 'width'),
        height: getSet(rect, 'height'),
        x1: getSet(rect, 'x'),
        y1: getSet(rect, 'y'),
        x2: {
          get: function(){
            return rect.x + rect.width;
          },
          set: function(x2){
            rect.width = x2 - rect.x;
          }
        },
        y2: {
          get: function(){
            return rect.y + rect.height;
          },
          set: function(y2){
            rect.height = y2 - rect.y;
          }
        }
      });
    }
  };
});
