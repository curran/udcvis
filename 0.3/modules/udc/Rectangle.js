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
    /**
    The x coordinate of the rectangle.
    @property x {Number}
    */
    this.x = x;
    /**
    The y coordinate of the rectangle.
    @property y {Number}
    */
    this.y = y;
    /**
    The width of the rectangle.
    @property w {Number}
    */
    this.w = w;
    /**
    The height of the rectangle.
    @property h {Number}
    */
    this.h = h;
  }
  Rectangle.prototype = {
    /**
    The length of the diagonal of this rectangle, `sqrt(w^2+h^2)`.
    @property diagonal {Number}
    */
    get diagonal(){
      var ww = this.w * this.w;
      var hh = this.h * this.h;
      return Math.sqrt(ww + hh);
    },
    /**
    The first x coordinate of the rectangle.
    Same as `x`.
    @property x1 {Number}
    */
    get x1(){ return this.x; },
    set x1(x1){ this.x = x1; },
    /**
    The second x coordinate of the rectangle.
    Equal to `x+w`.
    @property x2 {Number}
    */
    get x2(){ return this.x + this.w; },
    set x2(x2){ this.w = x2 - this.x; },
    /**
    The first y coordinate of the rectangle.
    Same as `y`.
    @property y1 {Number}
    */
    get y1(){ return this.y; },
    set y1(y1){ this.y = y1; },
    /**
    The second y coordinate of the rectangle.
    Equal to `y+h`.
    @property y2 {Number}
    */
    get y2(){ return this.y + this.h; },
    set y2(y2){ this.h = y2 - this.y; },
    /**
    Side effect: expands this rectangle
    to fit the given rectangle.
    @method expandToFit
    */
    expandToFit: function(rect){
      var a = this, b = rect;
      if(b.x < a.x){
        a.w += a.x - b.x;
        a.x = b.x;
      }
      if(b.y < a.y){
        a.h += a.y - b.y;
        a.y = b.y;
      }
      if(b.x2 > a.x2){
        a.w += b.x2 - a.x2;
      }
      if(b.y2 > a.y2){
        a.h += b.y2 - a.y2;
      }
    },
    /**
    Tests whether or not the given rectangle
    intersects this rectangle, returns a Boolean.
    @method intersects
    @param {Rectangle} rect
    */
    intersects:function(rect){
      return (
        this.x2 > rect.x1 &&
        this.x1 < rect.x2 &&
        this.y2 > rect.y1 &&
        this.y1 < rect.y2
      );
    }
  };
  return Rectangle;
});
