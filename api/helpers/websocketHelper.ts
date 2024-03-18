import { WebSocket } from 'ws';
import { ActiveConnection, UserFields } from '../types';
import User from '../models/User';
import Message from '../models/Message';
import { broadcastMessage } from './broadcastMessage';

export const handleWebSocketMessage = async (
  ws: WebSocket,
  message: string,
  activeConnection: ActiveConnection,
) => {
  const parsedData = JSON.parse(message);
  let messages = await Message.find()
    .populate('author', 'displayName')
    .sort({ _id: -1 })
    .limit(30);

  if (parsedData.type === 'LOGIN') {
    const user: UserFields | null = await User.findOneAndUpdate(
      { token: parsedData.payload.token },
      [{ $set: { isOnline: true } }],
    );
    if (user) {
      const token = parsedData.payload.token;
      activeConnection[token] = ws;
    }
    const onlineUsers: UserFields[] = await User.find(
      { isOnline: true },
      { displayName: 1 },
    );
    console.log('Client connected!', parsedData.payload.token);
    Object.values(activeConnection).forEach((connection) => {
      connection.send(
        JSON.stringify({ type: 'USERS', payload: { onlineUsers, messages } }),
      );
    });
  } else if (parsedData.type === 'LOGOUT') {
    const token = parsedData.payload.token;
    delete activeConnection[token];
    await User.findOneAndUpdate({ token }, { $set: { isOnline: false } });
    const onlineUsers: UserFields[] = await User.find(
      { isOnline: true },
      { displayName: 1 },
    );
    Object.values(activeConnection).forEach((connection) => {
      connection.send(
        JSON.stringify({ type: 'USERS', payload: { onlineUsers, messages } }),
      );
    });
  } else if (parsedData.type === 'SEND_MESSAGE') {
    const user: UserFields | null = await User.findOne({
      token: parsedData.payload.token,
    });
    if (user) {
      const message = new Message({
        author: user._id,
        text: parsedData.payload.text,
      });
      await message.save();

      const outgoingMsg = {
        type: 'NEW_MESSAGE',
        payload: {
          author: user,
          text: parsedData.payload.text,
        },
      };
      broadcastMessage(outgoingMsg, activeConnection);
    }
  } else if (parsedData.type === 'DELETE_MESSAGE') {
    const user = await User.findOne({
      role: parsedData.payload.role === 'admin' ? 'admin' : null,
    });
    if (user) {
      await Message.findOneAndDelete({ _id: parsedData.payload._id });
      messages = await Message.find()
        .populate('author', 'displayName')
        .sort({ _id: -1 })
        .limit(30);
      Object.values(activeConnection).forEach((connection) => {
        connection.send(
          JSON.stringify({ type: 'REFRESH_MESSAGE', payload: messages }),
        );
      });
    } else {
      ws.send(JSON.stringify({ type: 'NO_AUTH' }));
    }
  }
};

export const handleWebSocketClose = (
  activeConnection: ActiveConnection,
  token: string,
) => {
  delete activeConnection[token];
};
