/**
@module Geometry

@class Interval
 */
define([], function(){
  var proto = {};
  return {
    /**
    An Interval factory.

    Each Interval instance represents a numeric 
    interval between two numbers `a` and `b`. Instances
    expose readable and writable properties `a`, `b`, and `span`,
    which is `b-a`.

    @method create 
    @param {Number} a The beginning of the interval, a number smaller than `b`.
    @param {Number} b The end of the interval, a number larger than `a`.
    */
    create: function(a, b){
      return Object.create(proto, {
        a: {
          set: function(newA){ a = newA; },
          get: function(){ return a; }
        },
        b: {
          set: function(newB){ b = newB; },
          get: function(){ return b; }
        },
        span: {
          set: function(span){ b = a + span; },
          get: function(){ return b - a; }
        }
      });
    }
  };
});
