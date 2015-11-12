const EFFECT_SOCKETIO = "EFFECT_SOCKETIO";

export function socketIOMiddleware(io, actionFactories) {
    return store => {
        Object.keys(actionFactories).forEach((event) => {
            io.on(event, (data) => {
                const action = actionFactories[event](data)
                store.dispatch(action);
            });
        });
        return next => action => {
            action.type == EFFECT_SOCKETIO
                ? execute(action.payload)
                : next(action);

            function execute({event, data}) {
                io.emit(event, data);
            }
        }
    }
}

export function emit(eventName, data) {
    return {
        type: EFFECT_SOCKETIO,
        payload: {
            event: eventName,
            data,
        }
    }
}
