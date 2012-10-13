New additions and changes in this version:

Action sequences on the server are collapsed:
 - [set a=5, set a=6] is collapsed to [set a=6]
 - [set a=5, unset a] is collapsed to []
 
 This means that when an ASH client is initialized to the state of the shared session, only the necessary actions to achieve the final state are sent from the server, cutting down tremendously on the size of the initialization message. Previously, for example, every drag of a circle was recorded to the server and sent to each client for initialization. After implementing this, only the final coordinates of dragged circles are sent.
