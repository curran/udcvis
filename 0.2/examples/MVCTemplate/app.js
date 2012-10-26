require(['jquery', 'lib/underscore', 'lib/backbone',
         'udcvis/requestAnimFrame', 'udcvis/resizeCanvas',
         './model','./view','./controller'],
        function($, _, Backbone, 
                 requestAnimFrame, resize, 
                 model, view, controller) {
  $(function() {
    var canvas = $('canvas')[0];
    var c = canvas.getContext('2d');
    c.fillRect(0,0,50,50);

    function drawLine(x1, y1, x2, y2){
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    }
    
    function drawX(){
      drawLine(0, 0, canvas.width, canvas.height);
      drawLine(0, canvas.height, canvas.width, 0);
    }

    (function render(){
      requestAnimFrame(render);
      if(resize(canvas)){
        console.log('canvas resized');
        drawX();
      }
    })();
  });
});
