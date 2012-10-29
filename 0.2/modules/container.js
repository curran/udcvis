define(['udcvis/component','underscore'],
    function(component, _){
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
