// Generated by CoffeeScript 1.6.1
(function() {

  define([], function() {
    var Viewport;
    return Viewport = (function() {

      function Viewport(src, dest) {
        this.src = src;
        this.dest = dest;
      }

      Viewport.prototype.srcToDest = function(inPoint, outPoint) {
        outPoint.x = (inPoint.x - this.src.x) / this.src.w * this.dest.w + this.dest.x;
        return outPoint.y = (inPoint.y - this.src.y) / this.src.h * this.dest.h + this.dest.y;
      };

      Viewport.prototype.destToSrc = function(inPoint, outPoint) {
        outPoint.x = (inPoint.x - this.dest.x) / this.dest.w * this.src.w + this.src.x;
        return outPoint.y = (inPoint.y - this.dest.y) / this.dest.h * this.src.h + this.src.y;
      };

      return Viewport;

    })();
  });

}).call(this);
