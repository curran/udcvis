require(['udcvis/requestAnimFrame','udcvis/resizeCanvas',
         'udcvis/component', 'udcvis/container'], 
    function(requestAnimFrame, resize, component, container) {

  function drawLine(c, x1, y1, x2, y2){
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }
  
  function drawX(c, x, y, width, height){
    drawLine(c, x, y, width, height);
    drawLine(c, x, height, width, y);
  }

  var createColoredBox = function(color){
    var box = component.create();
    box.draw = function(c){
      var x = box.bounds.x,
          y = box.bounds.y,
          w = box.bounds.width,
          h = box.bounds.height
      c.fillStyle = color;
      c.fillRect(x, y, w, h);
      drawX(c, x, y, x + w, y + h);
    }
    return box;
  }

  var root = container.hbox([
    createColoredBox('red'),
    createColoredBox('green'),
    container.vbox([
      createColoredBox('red'),
      createColoredBox('green'),
      container.hbox([
        createColoredBox('red'),
        createColoredBox('green'),
        container.vbox([
          createColoredBox('red'),
          createColoredBox('green'),
          createColoredBox('blue')
        ])
      ])
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
