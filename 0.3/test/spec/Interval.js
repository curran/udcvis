define(["udc/Interval"], function(Interval) {
  describe("Interval", function() {
    var interval = new Interval(5, 11);
    it("should set a and b on new Intervals", function(){
      expect(interval.a).toEqual(5);
      expect(interval.b).toEqual(11);
    });
    it("should compute span", function(){
      expect(interval.span()).toEqual(6);
    });
    it("should set span", function(){
      interval.setSpan(20);
      expect(interval.span()).toEqual(20);
      expect(interval.a).toEqual(5);
      expect(interval.b).toEqual(25);
    });
    it("should compute min and max", function(){
      expect(interval.min()).toEqual(5);
      expect(interval.max()).toEqual(25);

      interval.a = 5;
      interval.b = 1;

      expect(interval.min()).toEqual(1);
      expect(interval.max()).toEqual(5);
    });
  });
});
