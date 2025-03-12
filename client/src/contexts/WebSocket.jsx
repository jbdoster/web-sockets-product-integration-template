import { createContext, useContext, useEffect, useState } from 'react';

import { Context as StorageContext } from "./Storage"

import * as mocks from "../mocks";

const bufferToObject = (buffer) => {
    try {
      return JSON.parse(buffer.toString("utf-8"));
    }
    catch(error) {
      throw new Error("Could not read websocket message data.");
    }
  }

export const Context = createContext({});

/**
 *  Using a React Context so we can isolate and control
 *  the web socket connection.
 *  This provides a common interface so when things change
 *  all other components depending on this interface require
 *  minimal updates.
 */
export const Component = ({ children }) => {
    const {
        storageContext
    } = useContext(StorageContext)
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState();

    const emitEvent = ({
        event,
        data,
    }) => {
        if (!connected) {
            throw new Error("Web socket not connected.");
        }
        else if (!storageContext?.sessionId) {
            throw new Error("No session ID recorded. User is not logged in.")
        }
        else {
            const message = {
                event,
                data,
                sessionId: storageContext.sessionId,
            };
            const encoded = JSON.stringify(message);
            socket.send(encoded);
        }
    }

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socket.addEventListener("open", (event) => {
          if (connected) return;
          setConnected(true);
          mocks.emitAnalyticsEvent("WEB_SOCKET_CONNECTION_OPENED", event);
        });
        
        socket.addEventListener("message", (event) => {
          mocks.emitAnalyticsEvent("WEB_SOCKET_MESSAGE_RECEIVED", event);
          const decoded = JSON.parse(event.data);
          alert(decoded.data.message)
        });

        setSocket(socket);
    }, []);

    return (
        <Context.Provider
            value={{
                connected,
                emitEvent,
                setConnected,
            }}
        >
        {children}
        </Context.Provider>
    )
}