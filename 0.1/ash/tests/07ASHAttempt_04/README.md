New additions and changes in this version:
# var resourceIdCounter
This is the integer counter which generates the ASH resource Ids returned by ASH.genResourceId(). If this variable were initialized to the same number for every client, or for that matter if ASH.genResourceId() ever returned the same number to two different clients in a shared ASH session, the result would be that newly created resources may end up 'reclaiming' resource Ids used already by other clients to create a resource in the shared session.

For example, the following could happen:
 1 Client A creates resource with id '1' and assigns it to be of type 'Circle'
 2 Client B creates resource with id '1' and assigns it to be of type 'Square'
, which results in undefined and unpredictable behavior.

Any solution to this problem must provide a guarantee that each time ASH.genResourceId() is called from any client within a shared ASH session, it always returns a different value.

One solution to this problem is to partition the Integers into fixed size chunks (e.g. 0-50, 50-100, 100-150, etc.), and assign chunks at a time to each client. This way, the client can increment the local variable to generate unique Ids, until it uses all the integers in the range given by the server.

When a client uses all the integers in its range of resource Id integers, it can request another chunk. This has the implication that any call to ASH.genResourceId() may need to wait for a round trip to the server before a value is returned. Therefore ASH.genResourceId() must be turned into an asynchronous request (as we need to avoid blocking calls in JavaScript's single threaded environment), meaning it becomes ASH.genResourceId(callback) where 'callback' is a function that takes as an agrument a resource Id: 'function(resourceId){ ... }'. In this case the code that uses the Id to create a new ASH resource must be placed inside the callback function.

The solution in which each client requests a range of resource Ids AFTER it uses all of its current range can be implemented by having each client maintain the following variables in memory:
 - resourceIdMin - The minimum (inclusive) of the client's range of resource Ids.
     - "Inclusive" meaning that resourceIdMin can be used as a resource Id.
 - resourceIdMax - The maximum (exclusive) of the client's range of resource Ids.
     - "Exclusive" meaning that resourceIdMax cannot be used as a resource Id.
 - resourceIdCounter - A counter which enumerates each available Id in the range between resourceIdMin (inclusive) and resourceIdMax (exclusive).
 - waitingForIdRange - True after the client has requested a new range of Ids and before the client has received a response to that request from the server.
 - pendingGenResourceIdCallbacks - A list of callbacks that will be called when the server message containing a new range of Ids is received by the client (only populated when waitingForIdRange = true).
 
The code must be written such that the callback function passed into ASH.genResourceId(callback) be called only when the following conditions are guaranteed to be true:
 - resourceIdMin and resourceIdMax have been initialized by the server
 - (resourceIdMin <= resourceId < resourceIdMax) = true, where 'resourceId' is the value passed into the callback function.
 
The following new variables have been introduced in the server:
 - resourceIdCounter - the session-global resource Id counter
 - resourceIdRangeSize - the number of Ids granted at one time to clients

An elaboration of this solution is to have the client request a new range of Ids BEFORE it uses all of its current range. If a client requests a new range of Ids after the counter is a certain fraction of the way through using its current range of Ids, the client would ALMOST ALWAYS have an Id available in memory (let's call these Ids "buffered Ids"). This means the callback function passed to ASH.genResourceId(callback) would AMLOST ALWAYS be called right away. However, since there is still a chance that all ASH.genResourceId() is called and there are no buffered Ids (e.g. by programmatically creating more new resources than there are buffered Ids), the function must still be asynchronous (so it can wait for the server if it needs 
