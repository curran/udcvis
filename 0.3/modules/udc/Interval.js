/**
A numeric interval between two values `a` and `b`.

@class Interval
@constructor 
@param {Number} a The beginning of the interval.
@param {Number} b The end of the interval.
*/
function Interval(a, b){
  /**
  The beginning of the interval.
  @property a {Number}
  */
  this.a = a;
  /**
  The end of the interval.
  @property b {Number}
  */
  this.b = b;
}
Interval.prototype = {
  /**
  @method getSpan
  @return {Number} `b-a`.
  */
  getSpan: function(){
    return this.b - this.a;
  },
  /**
  Modifies `b` such that `b-a = span`.
  @method setSpan
  @param {Number} span The new value for `b-a`.  
  @return {Number} `b-a`.
  */
  setSpan: function(span){
    this.b = a + span;
  },
  /**
  @method min
  @return {Number} `min(b,a)`.
  */
  min: function(){
    return Math.min(this.a, this.b);
  },
  /**
  @method max
  @return {Number} `max(b,a)`.
  */
  max: function(){
    return Math.max(this.a, this.b);
  }
};
