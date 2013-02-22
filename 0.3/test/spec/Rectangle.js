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
  });
});
