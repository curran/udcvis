// A cross-browser shim for `requestAnimationFrame`.
//
// From this [Blog post from Paul Irish](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
define([],function(){
  return window.requestAnimationFrame  || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
});
