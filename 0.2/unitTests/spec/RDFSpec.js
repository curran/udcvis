define(["udcvis/rdf"], function(rdf) {
  describe("RDF", function() {
    it("should be able to resolve value ids", function() {
      expect(rdf.id('foo')).toEqual(1);
      expect(rdf.id('bar')).toEqual(2);
      expect(rdf.id('baz')).toEqual(3);
      expect(rdf.id('foo')).toEqual(1);
      expect(rdf.id('bar')).toEqual(2);
      expect(rdf.id('baz')).toEqual(3);
    });

    it("should be able to answer queries of the form (?,*,*)", function() {
      var foo = rdf.id('foo');
      var bar = rdf.id('bar');
      var baz = rdf.id('baz');
      rdf.insert(foo, bar, baz);
      var resultIterator = rdf.query('?','*','*');
      resultIterator.forEach(function(value){
        expect(value).toEqual(foo);
      });
    });
  });
});
