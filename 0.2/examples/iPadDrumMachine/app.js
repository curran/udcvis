// TODO Document this.
require(['udcvis/requestAnimFrame','udcvis/resizeCanvas',
         'udcvis/component','udcvis/container', 'underscore'], 
    function(requestAnimFrame, resize, component, container, _) {
  var createSpot = function(){
    var on = false;
    
    var spot = component.create();
    spot.draw = function(c){
      var x = spot.bounds.x,
          y = spot.bounds.y,
          w = spot.bounds.width,
          h = spot.bounds.height
      c.fillStyle = on ? 'white' : 'black';
      c.fillRect(x, y, w, h);
      c.strokeStyle = 'gray';
      c.lineWidth = 2;
      c.strokeRect(x, y, w, h);

      var cx = x + w / 2;
      var cy = y + h / 2;
      c.fillStyle = !on ? 'white' : 'black';
      c.beginPath();
      c.arc(cx, cy, h / 3, 0, Math.PI * 2);
      c.fill();
    };
    spot.pointDown = function(x, y){
      on = !on;
    }
    return spot;
  };
  
  var createSpots = function(level){
    if(level <= 0)
      return createSpot();
    else{
      return container.vbox([
        createSpot(),
        container.hbox([
          createSpots(level - 1),
          createSpots(level - 1)
        ]),
        container.hbox([
          createSpot(),
          createSpot(),
          createSpot()
        ])
      ]);
    }
  };
  var root = createSpots(3);

  (function(){
    var canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown',function(e){
      var x = e.pageX;
      var y = e.pageY;
      root.pointDown(x, y);
    });
    var c = canvas.getContext('2d');
    (function render(){
      requestAnimFrame(render);
      if(resize(canvas)){
        console.log('canvas resized');
      }
      root.setBounds(0, 0, canvas.width, canvas.height);
      root.draw(c);
    })();
  })();
});
