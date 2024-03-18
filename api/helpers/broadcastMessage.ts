import {ActiveConnection, IncomingMessage} from "../types";

export const broadcastMessage = (message: IncomingMessage, activeConnection: ActiveConnection) => {
  Object.values(activeConnection).forEach(connection => {
    connection.send(JSON.stringify(message));
  });
};