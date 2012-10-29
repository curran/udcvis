// This modules provides means of creating 2D graphical components.
//
// Usage: `require(['udcvis/component'], function(component){})`
//
// This module provides the basis for [`containers`](container.html)
// that can create tiled nested box arrangemends like this:
// <iframe width="450" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="../../examples/helloComponents/app.html"></iframe>
define([],function(){
// ## Responsibilities of Subtypes
  var componentPrototype = {
    // `draw(c)` Draws this component on the HTML5 Canvas context `c`.
    //
    draw: function(c){
      //  * Must be implemented by subtypes.
    },
    // `pointDown(id, x, y)` Gets called when a point (either the mouse
    //   or a touch point) gets pressed down.
    //
    //  * `id` The id of the touch.
    //  * (`x`,`y`) The touch coordinates.
    pointDown: function(id, x, y){
      //  * May be implemented by subtypes (optional).
    }
  }
  // ## Public API
  return {
    // `create()` Returns a component object `c` with the following properties:
    //
    create: function(){
      // * By default, `c.bounds` is set to (0, 0, 100, 100).
      var bounds = {
        x: 0, y: 0, width: 100, height: 100
      };
      var setBounds = function(x, y, width, height){
        bounds.x = x;
        bounds.y = y;
        bounds.width = width;
        bounds.height = height;
      };
      var component = Object.create(componentPrototype, {
      // * `c.bounds` Evaluates to the 2D bounds of this
      //   component.
        bounds: {
          get: function(){
            return bounds;
          }
        },
      // * `component.setBounds(x, y, width, height)` Sets the 2D 
      //   bounds of this component.
        setBounds: {
          value: setBounds,
          writable: false,
          configurable: false
        }
      });
      return component;
    }
  };
});
