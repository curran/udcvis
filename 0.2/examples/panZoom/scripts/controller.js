define(['jquery','./model', 
    'udcvis/resizeCanvas'],
    function($, model, resize) {
  var canvas = $('#canvas')[0],
      sensitivity = {
        pan: 0.0005,
        zoom: 0.001
      },
      dampening = {
        pan: 0.95,
        zoom: 0.95
      },
      epsilon = 0.0001,
      velocity = {
        scale: 0,
        x: 0,
        y: 0
      },
      keys = {
        up: 38, down: 40, left: 37, right: 39,
        c: 67, d: 68,
        h: 72, j: 74, k: 75, l: 76
      },
      keysDown = {};
      actions = {};

  actions[keys.c] = function(){
    velocity.scale += sensitivity.zoom;
  };

  actions[keys.d] = function(){
    velocity.scale -= sensitivity.zoom;
  };

  actions[keys.left] = function(){
    velocity.x -= sensitivity.pan;
  };
  actions[keys.h] = function(){
    velocity.x -= sensitivity.pan;
  };

  actions[keys.right] = function(){
    velocity.x += sensitivity.pan;
  };
  actions[keys.l] = function(){
    velocity.x += sensitivity.pan;
  };

  actions[keys.up] = function(){
    velocity.y -= sensitivity.pan;
  };
  actions[keys.k] = function(){
    velocity.y -= sensitivity.pan;
  };

  actions[keys.down] = function(){
    velocity.y += sensitivity.pan;
  };
  actions[keys.j] = function(){
    velocity.y += sensitivity.pan;
  };

  $(document).keydown(function(event) {
    keysDown[event.which] = true;
  });

  $(document).keyup(function(event) {
    delete keysDown[event.which];
  });

  return {
    executeFrame: function(){

      // Poll for canvas resize
      if(resize(canvas)){
        model.setCanvasBounds(
          0, 0, canvas.width, canvas.height
        );
      }

      // execute actions each frame for held-down keys
      for(var key in keysDown){
        var action = actions[key];
        if(action)
          action();
      }

      // Increment the viscous fluid simulation
      // for smooth pan and zoom.
      if( Math.abs(velocity.scale) > epsilon ||
          Math.abs(velocity.x) > epsilon ||
          Math.abs(velocity.y) > epsilon){

        var scale = model.getScale();
        model.setScale(
          scale * (1 + velocity.scale)
        );

        var pan = model.getPan(),
            viewSize = model.getViewBounds().width;
        model.setPan(
          pan.x + velocity.x * viewSize,
          pan.y + velocity.y * viewSize
        );

        velocity.scale *= dampening.zoom;
        velocity.x *= dampening.pan;
        velocity.y *= dampening.pan;
      }
      else {
        velocity.scale = velocity.x = velocity.y = 0;
      }
    }
  };
});
