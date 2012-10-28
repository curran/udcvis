require(['udcvis/requestAnimFrame','udcvis/resizeCanvas',
         'udcvis/components'], 
    function(requestAnimFrame, resize, components) {
  var createColoredBox = function(color){
    function drawLine(c, x1, y1, x2, y2){
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    }
    
    function drawX(c, x, y, width, height){
      drawLine(c, x, y, width, height);
      drawLine(c, x, height, width, y);
    }

    return components.create({
      draw: function(c){
        var x = this.bounds.x,
            y = this.bounds.y,
            w = this.bounds.width,
            h = this.bounds.height
        c.fillStyle = color;
        c.fillRect(x, y, w, h);
        drawX(c, x, y, x + w, y + h);
      }
    });
  }

  var root = components.hbox([
    createColoredBox('red'),
    createColoredBox('green')
    ,components.vbox([
      createColoredBox('red'),
      createColoredBox('green'),
      createColoredBox('blue')
    ])
  ]);


  (function(){
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');
    (function render(){
      requestAnimFrame(render);
      if(resize(canvas)){
        console.log('canvas resized');
        root.setBounds(0, 0, canvas.width, canvas.height);
        root.draw(c);
      }
    })();
  })();
});
