define(["udc/Rectangle", "udc/RTree"], 
    function(Rectangle, RTree) {
  describe("RTree", function() {
    var bucketSize = 10,
        rTree = new RTree(bucketSize);
    it("should insert and retreive a single entry", 
        function(){
      var bounds = new Rectangle(0,0,1,1),
          queryRect1 = new Rectangle(-1,-1,3,3),
          queryRect2 = new Rectangle(5,5,1,1),
          item = "A", result;

      rTree.insert(bounds, item);

      result = rTree.query(queryRect1);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual("A");

      result = rTree.query(queryRect2);
      expect(result.length).toEqual(0);
    });
  });
});
