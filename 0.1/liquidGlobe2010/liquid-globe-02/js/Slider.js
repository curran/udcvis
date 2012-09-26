//Welcome to the Slider library!
// - Curran Kelleher 11-24-2010
//
//This "library" manages a set of interactive sliders for
//Processing.js sketches.
//
//Slider_setup,Slider_draw,Slider_mousePressed and
//Slider_mouseDragged must be called from the corresponding
//Processing.js methods in order for this to work.
//
//To add a slider to your sketch, call
//new Slider(x1,y1,x2,y2,min,max,value,knobSize)
//Calling this has the side effect of adding this
//newly created slider to a list of sliders
//for later drawing and manipulation
//
//To add a text label to the left side of a slider, call
//slider.addLabel(labelString)
//
//To add a text label displaying the value, call
//slider.showValue(nDigits)

//the global list of sliders to keep track of
var __Slider_sliders = [];
//the global font used by sliders to draw their text
var __Slider_font;
//the slider which is currently being dragged
var __Slider_sliderBeingDragged;

function Slider_setup(p){
  __Slider_font = p.loadFont("Arial");  
}

function Slider_draw(p){
  for(i in __Slider_sliders)
    __Slider_sliders[i].draw(p);
}

function Slider_mousePressed(p){
  __Slider_sliderBeingDragged = undefined;
  for(i in __Slider_sliders)
    if(__Slider_sliders[i].containsPoint(p.mouseX,p.mouseY)){
      __Slider_sliderBeingDragged = __Slider_sliders[i];
      __Slider_sliderBeingDragged.startDrag();
      break;
    }
}
function Slider_mouseReleased(p){
  if(__Slider_sliderBeingDragged != undefined){
    __Slider_sliderBeingDragged.endDrag();
    __Slider_sliderBeingDragged = undefined;
  }
}

function Slider_mouseDragged(p){
  if(__Slider_sliderBeingDragged)
    __Slider_sliderBeingDragged.setValueFromPixelCoordinates(p.mouseX,p.mouseY);
}

function Slider(x1,y1,x2,y2,min,max,value,knobSize){
  this._interval = new Interval(min,max);
  this._x = new Interval(x1,x2);
  this._y = new Interval(y1,y2);

  this._isBeingDragged = false;
  this.startDrag = function(){this._isBeingDragged = true;};
  this.endDrag = function(){this._isBeingDragged = false;};

  this._computeKnobXY = function(){
    this._knobX = this._interval.transformTo(this._x, value);
    this._knobY = this._interval.transformTo(this._y, value);
  };
  this._computeKnobXY();
  __Slider_sliders.push(this);

  this.draw = function(p){
    p.stroke(0);
    p.line(x1,y1,x2,y2);
    p.ellipseMode(p.CENTER);
    p.fill(255);
    p.stroke(0);
    p.ellipse(this._knobX,this._knobY, knobSize, knobSize);
  }
  /**
   * Call to add a label to this slider.
   * labelString: the string to draw as the label.
   * returns this for daisy chaining.
   */
  this.addLabel = function(labelString){
    var old_draw = this.draw;
    this.draw = function(p){
      old_draw.call(this,p);
      p.fill(0);
      p.textAlign(p.LEFT);
      p.textFont(__Slider_font, 20);
      p.text(labelString,x1,y1-2);
    }
    return this;
  }
  /**
   * Call to add a label showing the value of this slider.
   * nDigits: number of digits drawn
   * returns this for daisy chaining.
   */
  this.showValue = function(nDigits){
    var old_draw = this.draw;
    this.draw = function(p){
      old_draw.call(this,p);
      p.fill(0);
      p.textAlign(p.RIGHT);
      p.text(value.toFixed(nDigits),x2,y2-2);
    }
    return this;
  };

  /**
   * Adds the given function as an update callbackto this 
   * slider. The update callback will be called every time 
   * the value of this slider changes.
   * This slider is returned for daisy chaining of calls.
   */
  this.addCallback = function(callbackFunction){
    if(callbackFunction != undefined){
      var old__setValue = this._setValue;
      this._setValue = function(newValue){
        if(old__setValue.call(this,newValue)){
          callbackFunction(newValue);
          return true;
        }
        else
          return false;
      }
    }
    return this;
  };

  /**
   * Sets the value of this slider. This has no effect
   * when the user is dragging the slider.
   * Returns true if successfully set, false when:
   *  - in a drag
   *  - the new value is the same as the old value
   */
  this.setValue = function(newValue){
    if(this._isBeingDragged == true || value == newValue)
      return false;
    else
      return this._setValue(newValue);
  };
  this._setValue = function(newValue){
    var min = this._interval.getMin();
    var max = this._interval.getMax();
    value = (newValue < min) ? min: ((newValue > max) ? max : newValue);
    this._computeKnobXY();
    return true;
  }
  this.setValueFromPixelCoordinates = function(xPixel,yPixel){
    if(this._x.getMin() == this._x.getMax())
      this._setValue(this._y.transformTo(this._interval,yPixel));
    if(this._y.getMin() == this._y.getMax())
      this._setValue(this._x.transformTo(this._interval,xPixel));
    else
      this._setValue(
        this._x.transformTo(this._interval,xPixel)
                            +
        this._y.transformTo(this._interval,yPixel)
      )/2;
  };
  this.containsPoint = function(xPixel,yPixel){
    var dx = xPixel - this._knobX;
    var dy = yPixel - this._knobY;
    return dx*dx+dy*dy < knobSize*knobSize;
  }
  this.isBeingDragged = function(){return this._isBeingDragged;};
  this.setMin = function(newMin){this._interval.setMin(min = newMin);};
  this.setMax = function(newMax){this._interval.setMax(max = newMax);};
}
