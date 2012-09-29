define(['requestAnimFrame'], function(requestAnimFrame){
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  
  var radius = 5;

  var w = canvas.width, h = canvas.height;
  var n = 100000;
  var drawBatchSize  = 1000;

  var buffer = document.createElement('canvas');
  buffer.width = canvas.width;
  buffer.height = canvas.height;
  bufferContext = buffer.getContext('2d');

  var rand255 = function(){
    return Math.floor(Math.random() * 255);
  };

  var randomColor = function(){
    var r = rand255;
    return 'rgb('+r()+','+r()+','+r()+')';
  };
  // `c` = `canvas.context`
  var drawRandomSquare = function(c){
    c.fillStyle = randomColor();
    var x = Math.random() * w;
    var y = Math.random() * h;
    c.fillRect(x, y, 5, 5);
  };

  //for(var i = 0; i < n; i++){
  //  drawRandomSquare();
  //}
  var numSquaresDrawn = 0;
  (function iterate(i){
    numSquaresDrawn++;
    drawRandomSquare(bufferContext);
    if(i < n){
      if(i % drawBatchSize === 0)
        setTimeout(function(){
          iterate( i + 1 );
        }, 0);
      else
        iterate( i + 1 );
    }
  })(0);

  var time = new Date().getTime();
  (function render(){
    var newTime = new Date().getTime();
    var ms = newTime - time;
    time = newTime;
    requestAnimFrame(render);
    if(numSquaresDrawn)
      console.log([
        'numSquaresDrawn = ', numSquaresDrawn,
        ',\tms = ', ms
      ]);
    numSquaresDrawn = 0;
    c.drawImage(buffer, 0, 0);
  })();

});
