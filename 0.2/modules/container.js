define(['udcvis/component','underscore'],
    function(component, _){
    // ## Example
    //  * Click to toggle squares.
    // <iframe width="450" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="../../examples/iPadDrumMachine/app.html"></iframe>
    //  * [Source](https://github.com/curran/udcvis/blob/gh-pages/0.2/examples/iPadDrumMachine/app.js)
    //  * [Run Full Screen](../../examples/iPadDrumMachine/app.html)
  var create = function(orientation){
    if(orientation != 'vertical' && orientation != 'horizontal')
      throw new Error('orientation must be either'+
                      ' "horizontal" or "vertical"');
    var container = component.create();

    var children = [];
    var addChild = function(child){
      children.push(child);
    };
    var addChildren = function(children){
      _(children).each(addChild);
      return container;
    };
    /* TODO Move this into a `bounds` pseudoclass. */
    function inside(bounds, x, y){
      return (x < (bounds.x + bounds.width))
          && (x > bounds.x)
          && (y < (bounds.y + bounds.height))
          && (y > bounds.y);
    }

    var pointDown = function(x, y){
      _(children).each(function(child){
        if(inside(child.bounds, x, y)){
          child.pointDown(x, y);
        }
      });
    };

    var draw = function(c){
      var x = container.bounds.x,
          y = container.bounds.y,
          w = container.bounds.width,
          h = container.bounds.height,
          n = children.length;

      if(orientation === 'horizontal')
        _(children).each(function(child, i){
          child.setBounds(x + (i / n) * w, y, w / n, h);
        });
      else if(orientation === 'vertical')
        _(children).each(function(child, i){
          child.setBounds(x, y + (i / n) * h, w, h / n);
        });

      _(children).invoke('draw', c);
    };

    container.addChild = addChild;
    container.addChildren = addChildren;
    container.draw = draw;
    container.pointDown = pointDown;
    return container;
  };
  var box = function(orientation){
    return function(children){
      return create(orientation).addChildren(children);
    };
  };
  return {
    create: create,
    hbox: box('horizontal'),
    vbox: box('vertical')
  };
});
