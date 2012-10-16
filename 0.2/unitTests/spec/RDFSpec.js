define(["udcvis/rdf"], function(rdf) {
  describe("RDF", function() {
    it("should be able to get foo", function() {
      expect(rdf.foo()).toEqual("bar");
    });
  });
});
