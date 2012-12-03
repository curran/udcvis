// Linear interpolation. Usage:
//
// `interpolate(x).from(min1, max1).to(min2, max2)`
define([], function(){
  var _value, _min1, _max1;
  var chain = {
    from: function(min1, max1){
      _min1 = min1;
      _max1 = max1;
      return chain;
    },
    to: function(min2, max2){
      return (_value - _min1) / (_max1 - _min1) * (max2 - min2) + min2;
    }
  };
  return function(value){
    _value = value;
    return chain;
  };
});
