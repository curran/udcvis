define([],function(){
  return {
    // `queue.create()` Creates a queue object `q` with the following methods:
    create: function(){
      var q = [];
      return Object.create({
        // `q.enqueue(element)` Enqueues an element.
        enqueue: function(elem){
          q.push(elem);
        },
        // `q.dequeue()` Dequeues an element.
        dequeue: function(){
          return q.shift();
        },
        // `q.peek()` Returns the element that would be
        // returned by `q.dequeue()`, causing no side effect.
        peek: function(){
          return q.length > 0 ? q[0] : undefined;
        },
        // `q.pop()` Returns the element at the end
        // of the list and removes it.
        pop: function(){
          return q.pop();
        }
      },{
        length: {
          set:function(){},
          get:function(){
            return q.length;
          }
        }
      });
    }
  };
});
