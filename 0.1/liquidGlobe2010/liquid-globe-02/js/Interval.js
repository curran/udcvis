function Interval(min,max){
  this._span = max-min;
  this.getSpan = function(){return this._span};
  this.getMin = function(){ return min;};
  this.getMax = function(){ return max;};
  this.setMin = function(newMin){ this._span = max - (min = newMin); };
  this.setMax = function(newMax){ this._span = (max = newMax) - min; };
  
  /**
   * Transforms x, number in this interval, to 
   * a number in the same "location" (percentage point)
   * in the given interval.
   */
  this.transformTo = function(interval, x){
    /* | span| */
    /* min--x--max   */
    if(max == min)
      return interval.getMiddle();
    else
      return (x-min)/this._span*(interval.getSpan())+interval.getMin();
  }
  /**
   * Reflects a number x in this interval by the center of this interval.
   * Returns the reflected x.
   */
  this.flip = function(x){ return max - (x-min); }
  /**
   * Returns the midpoint of this interval.
   */
  this.getMiddle = function(){return (max+min)/2;}
}
