import express from 'express';
import expressWs from 'express-ws';
import mongoose from "mongoose";
import config from "./config";
import cors from 'cors';
import usersRouter from "./routes/users";
import User from "./models/User";
import {ActiveConnection, UserFields, UserModel} from "./types";
import Message from "./models/Message";
import {broadcastMessage} from "./helpers/broadcastMessage";

const app = express();
expressWs(app);

const port = 8000;
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);

const chatRouter = express.Router();
const activeConnection: ActiveConnection = {};

chatRouter.ws('/chat', async (ws, _req) => {
  let user;
  ws.send(JSON.stringify({type: 'WELCOME', payload: 'You have connected to the chat!'}));
  ws.on('message', async (message) => {
    const parsedData = JSON.parse(message.toString());
    if (parsedData.type === 'LOGIN') {
      user = await User.findOneAndUpdate({token: parsedData.payload.token}, [{$set: {isOnline: {$eq: [false, '$isOnline']}}}]);
      const messages = await Message.find().populate('author', 'displayName');
      if (user) {
        const token = parsedData.payload.token;
        activeConnection[token] = ws;
      }
      const onlineUsers = await User.find({isOnline: true}, {displayName: 1});
      console.log('Client connected!', parsedData.payload.token);
      ws.send(JSON.stringify({type: 'USERS', payload: {onlineUsers, messages}}));
    }
    if (parsedData.type === 'LOGOUT') {
      const token = parsedData.payload.token;
      delete activeConnection[token];
    }
    if (parsedData.type === 'SEND_MESSAGE') {
      const user = await User.findOne({token: parsedData.payload.token});
      const message = new Message({
        author: user?._id,
        text: parsedData.payload.text,
      });
      await message.save();
      const outgoingMsg = {
        type: 'NEW_MESSAGE', payload: {
          author: user,
          text: parsedData.payload.text,
        }
      };
      broadcastMessage(outgoingMsg, activeConnection);
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected!');
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
