define([], function () {
  function create() {
    var a = 3,
        b = 4;
        // see http://bost.ocks.org/mike/chart/
        my = {};

    my.a = function(value) {
      if (!arguments.length) return a;
      a = value;
      console.log('a was changed to ' + a + ' in module bar');
      return my;
    };

    my.b = function(value) {
      if (!arguments.length) return b;
      b = value;
      console.log('b was changed to ' + b + ' in module bar');
      return my;
    };

    return my;
  }
  return {create: create};
});
