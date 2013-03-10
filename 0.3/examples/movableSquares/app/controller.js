define(['udc/FullScreenCanvas', 'app/model',
        'app/Node'], 
    function(screen, model, Node){

  var nodeBeingDragged,
      dragX1, dragY1, dragX2, dragY2,
      nodeX1, nodeX2;

  screen.canvas.addEventListener('mousemove', function(e){
    var mouseX = e.pageX,
        mouseY = e.pageY;

    if(nodeBeingDragged){
      dragX2 = e.pageX;
      dragY2 = e.pageY;
      nodeBeingDragged.set({
        x: nodeX1 + dragX2 - dragX1,
        y: nodeY1 + dragY2 - dragY1
      });
      graphicsDirty = true;
    }
    else{
      updateCursor(e);
    }

  });

  function updateCursor(e){
    screen.canvas.style.cursor = (
      findNodeUnderMouse(e) ? 'move' : 'default'
    );
  }

  function findNodeUnderMouse(e){
    return model.nodes.find(function(node){
      var x = node.get('x'), y = node.get('y'),
          w = node.get('w'), h = node.get('h');
      return e.pageX > x && e.pageX < (x+w) &&
             e.pageY > y && e.pageY < (y+h);
    });
  }

  function createNewNode(e){
    return new Node({
      x: e.pageX - 50,
      y: e.pageY - 50,
      w: 100,
      h: 100
    });
  }

  screen.canvas.addEventListener('mousedown', function(e){
    var nodeUnderMouse = findNodeUnderMouse(e);
    
    if(nodeUnderMouse){
      nodeBeingDragged = nodeUnderMouse;
      nodeX1 = nodeUnderMouse.get('x');
      nodeY1 = nodeUnderMouse.get('y');
      dragX1 = e.pageX;
      dragY1 = e.pageY;
    }
    else{
      model.nodes.add(createNewNode(e));
    }
  });

  screen.canvas.addEventListener('mouseup', function(e){
    var nodeUnderMouse;
    if(nodeBeingDragged){
      if(dragX1 == e.pageX && dragY1 == e.pageY){
        nodeUnderMouse = findNodeUnderMouse(e);
        if(nodeUnderMouse){
          console.log("here");
          model.nodes.remove(nodeUnderMouse);
        }
      }
      nodeBeingDragged = undefined;
    }
    updateCursor(e);
  });

  screen.canvas.addEventListener('mouseout', function(e){
    nodeBeingDragged = undefined;
  });
});
