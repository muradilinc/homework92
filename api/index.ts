import express from 'express';
import expressWs from 'express-ws';
import mongoose from 'mongoose';
import config from './config';
import cors from 'cors';
import usersRouter from './routes/users';
import { ActiveConnection, UserFields } from './types';
import {
  handleWebSocketClose,
  handleWebSocketMessage,
} from './helpers/websocketHelper';

const app = express();
expressWs(app);

const port = 8000;
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);

const chatRouter = express.Router();
const activeConnection: ActiveConnection = {};

chatRouter.ws('/chat', async (ws, _req) => {
  let user: UserFields;
  ws.send(
    JSON.stringify({
      type: 'WELCOME',
      payload: 'You have connected to the chat!',
    }),
  );
  ws.on('message', async (message) => {
    await handleWebSocketMessage(ws, message.toString(), activeConnection);
  });
  ws.on('close', () => {
    if (user) {
      handleWebSocketClose(activeConnection, user.token);
    }
  });
});

app.use(chatRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log('We r online port: ' + port);
  });

  process.on('exit', () => {
    mongoose.disconnect();
    console.log('disconnected');
  });
};

void run();
