// ## The Model Module
// 
// Responsible for
//
//  * managing the data backing the state of the application, and 
//  * notifying observers of changes.
//
// For changes to points, use the `change` event:
//
//  * To listen, use `model.on('change', function(){...});`
//  * To fire the event, use `model.trigger('change');`
//
// The model's data consists of:
//
define(function(){
  //  * `t` is the parameter in the parametric line equation
  var t = 0.5;

  //  * a set of points - an array of objects with `x` and `y` properties.
  var points = [];

  //  * The radius (in pixels) used for drawing all points.
  var pointRadius = 7;

  // The exported API contains the following functions:
  var exports = {
    //  * `model.addPoint(x, y)` adds a point to the model's
    //     list of points. This causes the `change` event to fire.
    addPoint: function(x, y){
      //    * Only 2 points are allowed in this example.
      if(points.length < 2){
        var point = {x: x, y: y};
        points.push(point);
        this.trigger('change');
        return point;
      }
      else{
        console.err('Only 2 points are allowed.');
      }
    },
    //  * `model.removePoint(point)` removes the given point object
    //    from the model's list of points.
    //    This causes the `change` event to fire.
    removePoint: function(point){
      points.splice(points.indexOf(point), 1);
      this.trigger('change');
    },
    //  * `model.points` exposes the model's list of points
    points: points,
    //  * `model.getPointRadius()` returns the point radius
    getPointRadius: function(){ return pointRadius; },
    getT: function(){ return t; },
    setT: function(newT){
      t = newT;
      this.trigger('change');
    }
  };
  // [Backbone Events](http://backbonejs.org/#Events)
  // are used. The only event used by this module
  // is `change`, which gets fired whenever 
  // a point is added, removed, or changed.
  return _.extend(exports, Backbone.Events);
});
