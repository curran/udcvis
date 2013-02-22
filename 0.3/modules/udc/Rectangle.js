define([], function(){
  /**
  A 2D rectangle `(x, y, width, height)`.

  @class Rectangle
  @constructor 
  @param {Number} x
  @param {Number} y
  @param {Number} w Width
  @param {Number} h Height
  */
  function Rectangle(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  Rectangle.prototype = {
    /**
    @method diagonal
    @return {Number} The length of the diagonal of this rectangle, `sqrt(w^2+h^2)`.
    */
    diagonal: function(){
      var ww = this.w * this.w;
      var hh = this.h * this.h;
      return Math.sqrt(ww + hh);
    },
    /**
    @method x1
    @return {Number} `x+w`
    */
    x1: function(){
      return this.x + this.w;
    },
    /**
    @method y1
    @return {Number} `y+w`
    */
    y1: function(){
      return this.y + this.h;
    }
  };
  return Rectangle;
});
