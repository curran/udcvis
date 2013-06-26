define [], () ->
  proto = set: (@x, @y) ->
  create: (x, y) -> Object.create proto, 
    x: value: x
    y: value: y
