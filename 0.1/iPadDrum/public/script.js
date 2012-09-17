var socket = io.connect('http://localhost');

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

var magicNumber = 9;// try 1,2,3,4,5,6,7,8,9,10 (or 8.5!)

var minFrequency = 100; // in Hertz
var maxFrequency = 700; // in Hertz
var period = 1/8; // in Seconds

if(window.webkitAudioContext){
  var context = new webkitAudioContext();
  var osc = context.createOscillator();
  var oscGain = context.createGainNode();
  osc.connect(oscGain);
  oscGain.connect(context.destination);
  oscGain.gain.value = 0;
  osc.noteOn(0);
  var noteTime = 0;
  function schedule(){
    while (noteTime < context.currentTime + 0.200) {
      osc.frequency.setValueAtTime(frequency(), noteTime);
      oscGain.gain.linearRampToValueAtTime(1, noteTime+0.001);
      oscGain.gain.linearRampToValueAtTime(0, noteTime+period/2);
      oscGain.gain.linearRampToValueAtTime(0, noteTime+period);
      noteTime += period;
    }
    setTimeout(schedule, 30);
  }
  function frequency(){
    var min = minFrequency, max = maxFrequency;
    var variation = Math.sin(noteTime * Math.PI * magicNumber);
    return min + (variation/2+0.5) * (max - min);
  }
  schedule();
}

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

c.fillRect(0,0,canvas.width, canvas.height);

var paintColors = {};
var mouseId = 'mouse';
var mouseDown = false;

function setRandomPaintColor(id){
  function rand255(){ return Math.floor(Math.random()*255);}
  paintColors[id] = 'rgb('+rand255()+','+rand255()+','+rand255()+')';
}

function drawCircle(x, y){
  c.beginPath();
  c.arc(x, y, 20, 0, 2 * Math.PI);
  c.fill();
}

function addMouseListeners(){
  canvas.addEventListener('mousemove', function(e){
    if(mouseDown){
      c.fillStyle = paintColors[mouseId];
      drawCircle(e.clientX, e.clientY);
    }
  });
  
  canvas.addEventListener('mousedown', function(e){
    mouseDown = true;
    setRandomPaintColor(mouseId);
  });
  
  canvas.addEventListener('mouseup', function(e){
    mouseDown = false;
  });
  
  canvas.addEventListener('dblclick', function(e){
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height);
  });
}

function addMultiTouchListeners(){
  canvas.addEventListener('touchmove',function(e){
    var i, touch;
    setRandomPaintColor();
    for(i = 0; i < e.targetTouches.length; i++){
      touch = e.targetTouches[i];
      c.fillStyle = paintColors[touch.identifier];
      drawCircle(touch.pageX, touch.pageY);
    }
  });
  
  canvas.addEventListener('touchstart',function(e){
    var i, touch;
    for(i = 0; i < e.changedTouches.length; i++){
      touch = e.changedTouches[i];
      setRandomPaintColor(touch.identifier);
    }
  });
  
  canvas.addEventListener('touchend',function(e){
    var i, touch;
    for(i = 0; i < e.changedTouches.length; i++){
      touch = e.changedTouches[i];
      console.log("removing "+touch.identifier);
      delete paintColors[touch.identifier];
    }
  });
}

// prevent scrolling
document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false); 

addMouseListeners();
addMultiTouchListeners();
