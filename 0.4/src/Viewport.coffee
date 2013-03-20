define [], ->
  class Viewport                                      
    constructor: (@src, @dest) ->
    srcToDest: (inPt, outPt) ->
      outPt.x = (inPt.x - @src.x) / @src.w * @dest.w + @dest.x
      outPt.y = (inPt.y - @src.y) / @src.h * @dest.h + @dest.y
    destToSrc: (inPt, outPt) ->
      outPt.x = (inPt.x - @dest.x) / @dest.w * @src.w + @src.x
      outPt.y = (inPt.y - @dest.y) / @dest.h * @src.h + @src.y
