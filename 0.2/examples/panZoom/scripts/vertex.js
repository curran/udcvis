define([],function(){
  var defaults = {
    x: 0, y: 0
  };

  var proto = {
    set: function(x, y){
      this.x = x;
      this.y = y;
    }
  };

  return {
    // `create(options)` Creates a new vertex object.
    // 
    //  * `options` is an object, or null, with properties:
    //    * `x`, `y` the coordinates
    //      * both are optional and default to 0
    create: function(options){
      options = options ? options : {};
      var vertex = Object.create(proto);
      _(vertex).extend(
        _.defaults(options, defaults)
      );
      return vertex;
    }
  };
});
