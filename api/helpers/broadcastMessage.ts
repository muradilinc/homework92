import { ActiveConnection, BroadcastMessage } from '../types';

export const broadcastMessage = (
  message: BroadcastMessage,
  activeConnection: ActiveConnection,
) => {
  Object.values(activeConnection).forEach((connection) => {
    connection.send(JSON.stringify(message));
  });
};
