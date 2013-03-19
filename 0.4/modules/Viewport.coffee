define [], ->
  class Viewport                                      
    constructor: (@src, @dest) ->
    srcToDest: (inPoint, outPoint) ->
      outPoint.x = (inPoint.x - @src.x) / @src.w * @dest.w + @dest.x
      outPoint.y = (inPoint.y - @src.y) / @src.h * @dest.h + @dest.y
    destToSrc: (inPoint, outPoint) ->
      outPoint.x = (inPoint.x - @dest.x) / @dest.w * @src.w + @src.x
      outPoint.y = (inPoint.y - @dest.y) / @dest.h * @src.h + @src.y
