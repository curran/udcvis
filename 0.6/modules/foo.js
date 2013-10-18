define([], function () {
  function create() {
    var x = 1,
        y = 2;
        // see http://bost.ocks.org/mike/chart/
        my = {};

    my.x = function(value) {
      if (!arguments.length) return x;
      x = value;
      console.log('x was changed to ' + x + ' in module foo');
      return my;
    };

    my.y = function(value) {
      if (!arguments.length) return y;
      y = value;
      console.log('y was changed to ' + y + ' in module foo');
      return my;
    };

    return my;
  }
  return {create: create};
});
