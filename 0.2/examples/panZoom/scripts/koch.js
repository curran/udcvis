define(['./vertex'], function(vertex){
  function koch(x1, y1, x5, y5, depth, vertices){
    //         3
    //        / \
    // 1 -- 2    4 -- 5
    var x2 = x1 + (x5 - x1) * 1/3,
        y2 = y1 + (y5 - y1) * 1/3,
        x3 = x1 + .5 * (x5 - x1) + (Math.sin(Math.PI / 3) * (y5-y1)) / 3,
        y3 = y1 + .5 * (y5 - y1) - (Math.sin(Math.PI / 3) * (x5-x1)) / 3,
        x4 = x1 + (x5 - x1) * 2/3,
        y4 = y1 + (y5 - y1) * 2/3;
    if(depth > 0){
      koch(x1, y1, x2, y2, depth - 1, vertices);
      koch(x2, y2, x3, y3, depth - 1, vertices);
      koch(x3, y3, x4, y4, depth - 1, vertices);
      koch(x4, y4, x5, y5, depth - 1, vertices);
    }
    else{
      vertices.push(vertex.create({x: x1, y: y1}));
      vertices.push(vertex.create({x: x2, y: y2}));
      vertices.push(vertex.create({x: x3, y: y3}));
      vertices.push(vertex.create({x: x4, y: y4}));
      vertices.push(vertex.create({x: x5, y: y5}));
    }
  }
  return {
    generateVertices: function(x1, y1, x2, y2, depth){
      var vertices = [];
      koch(x1, y1, x2, y2, depth, vertices);
      return vertices;
    }
  };
});
