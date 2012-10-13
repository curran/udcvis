# First ASH example app
This folder contains the first instantiation of the ASH architecture idea involving both server-client communications and interactive graphics. The application is a blank white canvase upon which users can:
 - Create circles by clicking
 - Move circles by dragging
 - Delete circles by clicking
 
The application is served in conjunction with a simple server which manages a single shared session between users. This means that whenever users access the application, they all have a shared application state, and all actions are synchronized between them.

## How it Works
The server side is based on a simple chat server example using WebSockets. However, because ASH is designed to be a general application state management framework for arbitrary JavaScript applications, it must ensure that all atomic action sequences occur in the same order for all clients. Otherwise inconsistent states may arise (e.g. User 1 deletes object A, but before that message gets to user B, user B sets A.foo = 5).

The simplest solution to the problem of consistency of atomic action sequences across clients is to force all atomic actions to go through the server, having the server be the final authority regarding the ordering of atomic actions.

To accomplish this, ASH is set up such that when plugins interact with the ASH model, those atomic actions are recorded locally, but the local ASH model is not changed. Rather, periodically those locally staged actions are broadcast to the server, which in turn broadcasts them to all other clients AND to the originating client. Only when the originating client gets the actions from the server does it actually modify the local ASH model. This ensures consistency, but the price we pay for this is a lag in interactive performance (by the time it takes to do a round trip to the server).
 
