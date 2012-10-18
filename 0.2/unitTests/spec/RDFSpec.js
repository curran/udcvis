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

    var foo = rdf.id('foo');
    var bar = rdf.id('bar');
    var baz = rdf.id('baz');
    rdf.insert(foo, bar, baz);

    it("should be able to recover values from ids", function(){
      expect(rdf.value(foo)).toEqual('foo');
      expect(rdf.value(bar)).toEqual('bar');
    });

    it("should answer queries of the form (?,*,*)", function() {
      expect(rdf.query('?', '*','*').next()).toEqual(foo);
    });

    it("should answer queries of the form (*,?,*)", function() {
      expect(rdf.query('*','?','*').next()).toEqual(bar);
    });

    it("should answer queries of the form (*,*,?)", function() {
      expect(rdf.query('*','*','?').next()).toEqual(baz);
    });

    var zoo = rdf.id('zoo');
    var zar = rdf.id('zar');
    var zaz = rdf.id('zaz');
    rdf.insert(zoo, zar, zaz);

    it("should answer queries of the form (?,id,id)", function() {
      expect(rdf.query('?', bar, baz).next()).toEqual(foo);
      expect(rdf.query('?', zar, zaz).next()).toEqual(zoo);
    });

    it("should answer queries of the form (id,?,id)", function() {
      expect(rdf.query(foo, '?', baz).next()).toEqual(bar);
      expect(rdf.query(zoo, '?', zaz).next()).toEqual(zar);
    });

    it("should answer queries of the form (id,id,?)", function() {
      expect(rdf.query(foo, bar, '?').next()).toEqual(baz);
      expect(rdf.query(zoo, zar, '?').next()).toEqual(zaz);
    });

    it("should answer queries of the form (?,id,*)", function() {
      expect(rdf.query('?', bar, '*').next()).toEqual(foo);
      expect(rdf.query('?', zar, '*').next()).toEqual(zoo);
    });

    it("should answer queries of the form (?,*,id)", function() {
      expect(rdf.query('?', '*', baz).next()).toEqual(foo);
      expect(rdf.query('?', '*', zaz).next()).toEqual(zoo);
    });

    it("should answer queries of the form (id,?,*)", function() {
      expect(rdf.query(foo, '?', '*').next()).toEqual(bar);
      expect(rdf.query(zoo, '?', '*').next()).toEqual(zar);
    });

    it("should answer queries of the form (*,?,id)", function() {
      expect(rdf.query('*', '?', baz).next()).toEqual(bar);
      expect(rdf.query('*', '?', zaz).next()).toEqual(zar);
    });

    it("should answer queries of the form (id,*,?)", function() {
      expect(rdf.query(foo, '*', '?').next()).toEqual(baz);
      expect(rdf.query(zoo, '*', '?').next()).toEqual(zaz);
    });

    it("should answer queries of the form (*,id,?)", function() {
      expect(rdf.query('*', bar, '?').next()).toEqual(baz);
      expect(rdf.query('*', zar, '?').next()).toEqual(zaz);
    });
  });
});
