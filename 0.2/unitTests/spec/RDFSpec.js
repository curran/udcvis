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
  });
});
