define(['requestAnimFrame'], function(requestAnimFrame){
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  
  var radius = 5;

  var w = canvas.width, h = canvas.height;
  var n = 300000;
  var drawBatchSize  = 1500;

  var numSquaresDrawn = 0;
  var startTime = Date.now();
  var frames = 0;

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
    numSquaresDrawn++;
    c.fillStyle = randomColor();
    var x = Math.random() * w;
    var y = Math.random() * h;
    c.fillRect(x, y, 5, 5);
  };

  /*numSquaresDrawn++;
    drawRandomSquare(bufferContext);
    if(i < n){
      if(i % drawBatchSize === 0)
        setTimeout(function(){
          iterate( i + 1 );
        }, 0);
      else
        iterate( i + 1 );
    } this is crap because it blows the call stack on drawBatchSize = 10000*/

  /*
   * this blocks the UI for 3 - 4 seconds when n = 300000
   *
  for(var i = 0; i < n; i++){
    drawRandomSquare();
  }
   */
  (function iterate(i){
    if(i < n){
      var batchDone = false;
      while(!batchDone && i < n){
        drawRandomSquare(bufferContext);
        batchDone = i++ % drawBatchSize === 0;
      }
      setTimeout(function(){
        iterate(i);
      }, 0);
    }
    else{
      var endTime = Date.now();
      var ms = (endTime - startTime);
      var seconds = ms / 1000;
      console.log('Batch size = '+drawBatchSize);
      console.log('Drew '+n+' squares in '+seconds+' seconds.');
      var avgFPS = frames / seconds;
      console.log('Average FPS = '+avgFPS);
      console.log('Average squares drawn per frame = '+(n/frames));

      /* sanity check to test correctness of iterator code */
      if(numSquaresDrawn != n)
        console.log('numSquaresDrawn = '+numSquaresDrawn);
    }
  })(0);

  var time = new Date().getTime();
  (function render(){
    var newTime = new Date().getTime();
    var ms = newTime - time;
    time = newTime;
    requestAnimFrame(render);
    //if(numSquaresDrawn)
    //  console.log([
    //    'numSquaresDrawn = ', numSquaresDrawn,
    //    ',\tms = ', ms
    //  ].join(''));
    //numSquaresDrawn = 0;
    c.drawImage(buffer, 0, 0);
    frames++;
  })();

});
