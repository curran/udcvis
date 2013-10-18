define([], function () {
  function create(app) {
    var divId, children, my = {};

    function update() {
      if(divId && layout) {
        document.getElementById(divId);
        //TODO
      }
    }

    my.divId = function (value) {
      if(!arguments.length) return divId;
      divId = value;
      update();
      return my;
    };

    my.children = function (value) {
      if(!arguments.length) return children;
      children = value;
      update();
      return my;
    };

    return my;
  }
  return {create: create};
});
