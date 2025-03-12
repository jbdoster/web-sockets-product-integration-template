import { WebSocketServer } from 'ws';

import * as mocks from "../mocks";

type Message = {
  event: string;
  data: Record<string, unknown>;
  sessionId: string;
}

const bufferToObject = (buffer: Buffer): Message => {
  try {
    return JSON.parse(buffer.toString("utf-8"));
  }
  catch(error) {
    throw new Error("Could not read websocket message data.");
  }
}

const errorEvent = (message: Message) => {
  const event = {
    event: "UPDATE_PROFILE_ERROR",
    data: {
      message: "Profile could not be updated.",
    },
  };
  return JSON.stringify(event);
}

const wss = new WebSocketServer({
  port: 8080,
});

/**
 * TODO
 * Store connection information in database.
 * Intersect sessionId with web socket ID in database table.
 * This way it can be mapped in memory when the connection opens.
 * Then messages can be routed appropriately.
 */
wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', async (buffer: Buffer) => {
    const message = bufferToObject(buffer);
    console.log('received: %s', message);
    const verified = await mocks.JwtVerification(message.sessionId);
    if (!verified) {
      // TODO - map error response by event label.
      ws.send(errorEvent(message));
      throw new Error("Relying Party ID token not verified by Authorization Server.");
    }

    // TODO - map function call by event label.
    try {
      await mocks.DataAccess.updateProfile(message);
      const event = {
        event: "UPDATED_PROFILE",
        data: {
          message: "Profile updated!",
        },
      };
      const encoded = JSON.stringify(event);
      ws.send(encoded);
    }
    catch(error) {
      console.error(error);
      ws.send(errorEvent(message));
    }
  });

});

mocks.AuthServer()