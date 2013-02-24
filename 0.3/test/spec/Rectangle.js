define(["udc/Rectangle"], function(Rectangle) {
  describe("Rectangle", function() {
    var rectangle = new Rectangle(10, 20, 30, 40);
    it("should set x, y, w, h on new Rectangles", function(){
      expect(rectangle.x).toEqual(10);
      expect(rectangle.y).toEqual(20);
      expect(rectangle.w).toEqual(30);
      expect(rectangle.h).toEqual(40);
    });
    it("should compute x1, y1", function(){
      expect(rectangle.x1()).toEqual(10 + 30);
      expect(rectangle.y1()).toEqual(20 + 40);
    });
    it("should compute diagonal", function(){
      var d = Math.sqrt(30*30 + 40*40);
      expect(rectangle.diagonal()).toEqual(d);
    });
    it("should expand to fit", function(){
      var a = new Rectangle(0, 0, 1, 1),
          b = new Rectangle(-1, -2, 1, 1),
          c = new Rectangle(5, 5, 1, 1);
      a.expandToFit(b);
      expect(a.x).toEqual(-1);
      expect(a.y).toEqual(-2);
      expect(a.w).toEqual(2);
      expect(a.h).toEqual(3);
      a.expandToFit(c);
      expect(a.x).toEqual(-1);
      expect(a.y).toEqual(-2);
      expect(a.w).toEqual(7);
      expect(a.h).toEqual(8);
    });
    it("should test intersection", function(){
      var a = new Rectangle(0, 0, 1, 1),
          b = new Rectangle(0.5, 0.5, 1, 1);
          c = new Rectangle(5, 5, 1, 1);

      expect(a.intersects(b)).toEqual(true);
      expect(a.intersects(c)).toEqual(false);
    });
  });
});
