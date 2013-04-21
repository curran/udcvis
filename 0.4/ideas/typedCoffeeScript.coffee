# A Language of Types for CoffeeScript
# ====================================
#
# Types
# -----
#
# * Numbers
#   * Integers
# * Strings
# * Arrays
# * Objects
#   * as a set of named and typed properties
#   * as a Map<KeyType, ValueType>
#
# Typed Things
# ------------
# * Variables
# * Functions
#   * Arguments
#   * Return Values
#
types = [
  'Number',
  'Integer',
  'String',
  'Array',
  'Object'
]

typedThings = [
  'Variables',
  'Arguments',
  'Return Values'
]

for type in types
  for thing in typedThings
    console.log " * #{type} #{thing}"
#
# Aim: consistency - use `<T>` for type.
#
# Examples
# --------
# * Number Variables
x <Number> = 3.14
# * Number Arguments
print = (x <Number>) -> console.log x
# * Number Return Values
square = (x <Number>)<Number> -> x*x
# * Integer Variables
x <Integer> = 5
# * Integer Arguments
print = (x <Integer>) -> console.log x
# * Integer Return Values
square = (x <Integer>)<Integer> -> x*x
# * String Variables
x <String> = "Hello"
# * String Arguments
print = (x <String>) -> console.log x
# * String Return Values
concat = (x <String>, y <String>)<String> -> x + y
# * Array Variables
x <Array> = [1,2,3,"Hello"]
y <Array<Number>> = [1,2,3]
z <Array<String>> = ["Hello", "World"]
# * Array Arguments
print = (xs <Array>) -> console.log x for x in xs
# * Array Return Values
square = (xs <Array>)<Array> -> x*x for x in xs
# * Object Variables
china <name:String, population:Number> =
  name: 'China'
  population:1354040000

dictionary <Map<String,String>> =
  "happy": "enjoying or characterized by well-being and contentment"
  "sad": "affected with or expressive of grief or unhappiness"

# * Object Arguments
print = (person <firstName:String, lastName:String>) ->
  console.log person.firstName, person.firstName


# * Object Return Values
getLargestCountry = ()<name:String, population:Number> ->
  name: 'China'
  population:1354040000

# Type Composition
# ----------------
#
# * Array of Objects
countries <Array<name:String, population:Number>> = [
  {name: 'China', population:1354040000 },
  {name: 'India', population:1210193422 },
  {name: 'United States', population:315712000 }
]
