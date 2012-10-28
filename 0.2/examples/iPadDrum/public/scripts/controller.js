define(['model'],function(model){
  var socket = io.connect('');
  var canvas = document.getElementById('canvas');

  socket.on('down', function (touches) {
    _(touches).each(function(touch){
      model.addTouch(touch);
    });
  });

  socket.on('up', function (touches) {
    _(touches).each(function(touch){
      model.removeTouch(touch);
    });
  });

  function buildMessage(e){
    var message = [];
    _(e.changedTouches).each(function(touch){
      message.push({
        id: touch.identifier,
        x: touch.pageX / canvas.width, 
        y: touch.pageY / canvas.height
      });
    });
    return message;
  }
   
  canvas.addEventListener('touchstart',function(e){
    socket.emit('down', buildMessage(e));
    e.preventDefault();
  });
  
  canvas.addEventListener('touchend',function(e){
    socket.emit('up', buildMessage(e));
    e.preventDefault();
  });
});
