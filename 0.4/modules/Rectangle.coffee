define [], ->
  class Rectangle                                     
    constructor: (@x, @y, @w, @h) ->
    x1:
      get: -> @x
      set: (@x) ->
    x2:
      get: -> @x + @w
      set: (x2) -> @w = x2 - @x
    y1:
      get: -> @y
      set: (@y) ->
    y2:
      get: -> @y + @h
      set: (y2) -> @w = y2 - @y
