define([],function(){
  // Thanks to Paul Irish
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function( callback ){
           setTimeout(callback, 1000 / 60);
         };
});
