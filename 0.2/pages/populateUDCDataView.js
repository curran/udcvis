require(['udcvis/udc', 'udcvis/rdf'], function(udc, rdf){
  var div = document.getElementById('udcDataView');
  var innerHTML = [
    '<ul>',
    '<li>',
    'Dimensions',
    '</li>'
  ];

  innerHTML.push('<ul>');
  (function addDimensions(){
    var addLevels = function(dimension){
      innerHTML.push('<ul>');
      var it = udc.levels(dimension), next;
      try{
        while(next = it.next()){
          innerHTML.push('<li>');
          innerHTML.push(rdf.query(next, rdf.qn('rdfs:label'),'?').next());
          innerHTML.push('</li>');
        }
      }
      catch(e){
        if(e.toString() != '[object StopIteration]')
          throw e;
      }
      innerHTML.push('</ul>');
    };
    var it = udc.dimensions(), 
        next = it ? it.next() : null;
    try{
      do{
        innerHTML.push('<li>');
        innerHTML.push(rdf.query(next, rdf.qn('rdfs:label'),'?').next());
        addLevels(next);
        innerHTML.push('</li>');
      } while(next = it.next())
    }
    catch(e){
      if(e.toString() != '[object StopIteration]')
        throw e;
    }
  })();
  innerHTML.push('</ul>');

  innerHTML.push('<li>');
  innerHTML.push('Measures');
  innerHTML.push('</li>');
  innerHTML.push('</ul>');
  div.innerHTML = innerHTML.join('');
});
