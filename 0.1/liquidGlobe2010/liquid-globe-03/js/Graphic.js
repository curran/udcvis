//Welcome to the Graphics library!
//Curran Kelleher 11-28-2010

//the global list of graphics to keep track of
var __Graphics_graphics = [];
//the global font used by graphics to draw their text
var __Graphics_font;
//the graphic which is currently being dragged
var __Graphics_graphicBeingDragged;

function Graphics_setup(p){
  __Graphics_font = p.loadFont("Arial");  
}

function Graphics_draw(p){
  for(i in __Graphics_graphics)
    __Graphics_graphics[i].draw(p);
}

function Graphics_mousePressed(p){
  __Graphics_graphicBeingDragged = undefined;
  for(i in __Graphics_graphics)
    if(__Graphics_graphics[i].containsPoint(p.mouseX,p.mouseY)){
      __Graphics_graphicBeingDragged = __Graphics_graphics[i];
      __Graphics_graphicBeingDragged.startDrag();
      break;
    }
   //document.body.style.cursor = 'crosshair';
}
function Graphics_mouseReleased(p){
  if(__Graphics_graphicBeingDragged != undefined){
    __Graphics_graphicBeingDragged.endDrag();
    __Graphics_graphicBeingDragged = undefined;
  }
}

function Graphics_mouseDragged(p){
  if(__Graphics_graphicBeingDragged)
    __Graphics_graphicBeingDragged.
      move(p.mouseX-p.pmouseX,p.mouseY-p.pmouseY);
}

function Graphics_keyPressed(p){
  console.log("in keyPressed");
}
function Graphics_keyReleased(p){
  console.log("in keyReleased");
}
function Graphic(x1,y1,x2,y2){

  this._isBeingDragged = false;
  this.startDrag = function(){this._isBeingDragged = true;};
  this.endDrag = function(){this._isBeingDragged = false;};
  this.isBeingDragged = function(){return this._isBeingDragged;};

  __Graphics_graphics.push(this);

  this.draw = function(p){
    p.stroke(0);
    p.rect(x1,y1,x2-x1,y2-y1);
    p.line(x1,y1,x2,y2);
  };
  this.containsPoint = function(x,y){
    return (x > x1) && (x < x2) && (y > y1) && (y < y2);
  };
  this.move = function(dx,dy){
    x1+=dx; x2+=dx; y1+=dy; y2+=dy;
  };
}
