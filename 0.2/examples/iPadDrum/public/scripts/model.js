define(['underscore','lib/backbone'], 
    function(_, Backbone){
  var gridWidth = 4;
  var gridHeight = 3;

  // `touches`
  //
  //  * Keys: touch ids
  //  * Values: objects with `x` and `y` - position values 
  //    normalized between 0 and 1.
  var touches = {};

  var model = {
    // Adds a touch to the model.
    //
    // `touches` - An array of objects with the following keys:
    //  * `id` - the touch id
    //  * `x` and `y` - position values normalized between 0 and 1.
    addTouch: function(touch){
      touches[touch.id] = {
        x: touch.x,
        y: touch.y
      };
      model.trigger('change');
    },
    removeTouch: function(touch){
      delete(touches[touch.id]);
      model.trigger('change');
    },
    touches: function(){
      return _(touches).values();
    },
    gridHeight: function(){
      return gridHeight;
    },
    gridWidth: function(){
      return gridWidth;
    }
  };

  _.extend(model, Backbone.Events);

  return model;
});
