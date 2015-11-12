import * as assert from "assert";
import * as sinon from "sinon";
import {default as sinonChai} from "sinon-chai";
import { emit, socketIOMiddleware } from "../src";
import chai, { expect } from "chai";

chai.use(sinonChai);

describe("The socketio middleware", () => {
    let fakeStore;
    let fakeNext;
    let fakeIO;
    let mw;
    let actionFactories;

    beforeEach(() => {
        fakeStore = ({dispatch: sinon.spy(), getState: () => {}});
        fakeNext = sinon.spy();
        fakeIO = {
            emit: sinon.spy(),
            listeners: {},
            on (event, listener) {
                this.listeners[event] = listener;
            },
            sendEvent (event, data) {
                const {[event]: listener} = this.listeners;
                if (listener){
                    listener(data);
                }
            },
        };
        actionFactories = {};
        mw = socketIOMiddleware(fakeIO, actionFactories)(fakeStore)(fakeNext);
    });

    it("should send message events to the socket", () => {
        const action =  emit("some_event", {somekey: "somevalue"});
        mw(action);
        expect(fakeIO.emit).to.have.been.calledWith("some_event", {somekey: "somevalue"});
    });

    it("should forward all non socketio events to the next middleware", () => {
        const action = {type: "SOME_TYPE", payload: {some: "data"}};
        mw(action)
        expect(fakeNext).to.have.been.calledWith(action);
    });

    context("when receiving events from the server", () => {
        it("should create actions using the action factory and dispatch them", () => {
            actionFactories = {"some_event": (data) => ({type: "SOME_EVENT", payload: data})};
            mw = socketIOMiddleware(fakeIO, actionFactories)(fakeStore)(fakeNext);
            fakeIO.sendEvent("some_event", {some: "data"})
            expect(fakeStore.dispatch).to.have.been.calledWith({type: "SOME_EVENT", payload: {some: "data"}});
        });
    });
});
