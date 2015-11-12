#redux-effects-socketio

#Installation

npm install redux-effects-socketio

#Usage

Create a socket object, then create middleware from it,


```javascript
import { createStore, applyMiddleware, compose } from "redux";
import effects from "redux-effects";
import {io} from "socket.io-client";

//This creates actions which will be dispatched when events are emitted by the socket
actionFactories = {
    "message": (data) => ({type: "SOME_EVENT", payload: data}),
}

socket = io();

const finalCreateStore = compose(
    applyMiddleware(effects, socketIOMiddleware(socket, actionFactories)),
)(createStore);


//Elsewhere, when you want to emit an event
import {emit} from "redux-effects-socketio";
store.dispatch(emit("some_message", {some: "data"}));

```
