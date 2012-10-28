// The `components` module provides an API for graphical components
// and nested box layout.
define(['underscore'], function(_){

  // `component` is the base prototype.
  var component = {
    bounds: {
      x: 0, y: 0, width: 100, height: 100
    },
    setBounds: function(x, y, width, height){
      this.bounds.x = x;
      this.bounds.y = y;
      this.bounds.width = width;
      this.bounds.height = height;
    },
    // `draw(c)` Draws this component on the HTML5 Canvas context `c`.
    draw: function(c){
      // `draw` should be implemented by subclasses.
    }
  };

  var createContainer = (function(){
    // `container` extends `component`.
    var container = _.extend(Object.create(component),{
      addChild: function(child){
        this.children.push(child);
        return this;
      },
      addChildren: function(children){
        _(children).each(_.bind(this.addChild, this));
        return this;
      },
      draw: function(c){
        console.log('draw');
        var x = this.bounds.x,
            y = this.bounds.y,
            w = this.bounds.width,
            h = this.bounds.height,
            n = this.children.length,
            setBounds = (this.orientation === 'vertical' ?
              function(child, i){
                child.setBounds(x, y + (i / n) * h, w, h / n);
              }:
              function(child, i){
                child.setBounds(x + (i / n) * w, y, w / n, h);
              }
            );
        _(this.children).each(function(child, i){
          setBounds(child, i);
          child.draw(c);
        });
      }
    });
    return function(orientation){
      if(orientation != 'vertical' && orientation != 'horizontal')
        throw new Error('orientation must be either "horizontal" or "vertical"');
      return _.extend(Object.create(container), {
        children: [],
        orientation: orientation
      });
    }
  })();
  //var box = function(orientation){
  //  return function(children){
  //    return createContainer(orientation).addChildren(children);
  //  }
  //};

  // `components` is the exported API.
  var components = {
    // `vbox` Creates a vertically oriented container.
    vbox: function(children){
      return createContainer('vertical').addChildren(children);
    },
    // `hbox` Creates a horizontally oriented container.
    hbox: function(children){
      return createContainer('horizontal').addChildren(children);
    },
    // `create(impl)` Creates a container extended with the
    // given `impl` object, which should contain the following properties:
    //
    //  * `draw(c)` An implementation of the drawing function.
    create: function(impl){
      return _.extend(Object.create(component), impl);
    }
  };
  return components;
});
