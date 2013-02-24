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
    },
    /**
    Side effect: expands this rectangle
    to fit the given rectangle.
    @method expandToFit
    */
    expandToFit: function(rect){
      if(rect.x < this.x){
        this.w += this.x - rect.x;
        this.x = rect.x;
      }
      if(rect.y < this.y){
        this.h += this.y - rect.y;
        this.y = rect.y;
      }
      if(rect.x1() > this.x1())
        this.w = rect.x1() - this.x;
      if(rect.y1() > this.y1())
        this.h = rect.y1() - this.y;
    },
    /**
    Tests whether or not the given rectangle
    intersects this rectangle, returns a Boolean.
    @method intersects
    @param {Rectangle} rect
    */
    intersects:function(rect){
      return (
        this.x1() > rect.x &&
        this.x < rect.x1() &&
        this.y1() > rect.y &&
        this.y < rect.y1()
      );
    }
  };
  return Rectangle;
});
