define([], function(){
  return function(level, i, j){
    return [level,i,j].join('_');
  };
});
