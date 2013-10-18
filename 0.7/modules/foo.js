define(['backbone'], function (Backbone) {
  return function constructor() {
    var foo = new Backbone.Model({
      x: 1,
      y: 2
    });
    foo.on('change:x', function () {
      var x = foo.get('x');
      console.log('foo.x changed to ' + x);
    });
    foo.on('change:y', function () {
      var y = foo.get('y');
      console.log('foo.y changed to ' + y);
    });
    console.log('Created an instance of foo');
    return foo;
  };
});
