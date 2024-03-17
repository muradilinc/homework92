import express from 'express';
import expressWs from 'express-ws';
import mongoose from "mongoose";
import config from "./config";
import cors from 'cors';
import usersRouter from "./routes/users";
import User from "./models/User";
import {ActiveConnection, UserModel} from "./types";

const app = express();
expressWs(app);

const port = 8000;
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
const chatRouter = express.Router();
const activeConnection: ActiveConnection = {
  users: [],
};

chatRouter.ws('/chat', async (ws, req) => {
  ws.send(JSON.stringify({type:'WELCOME', payload: 'You have connected to the chat!'}));
  ws.on('message', async (message) => {
    const parsedData = JSON.parse(message.toString());
    if (parsedData.type === 'LOGIN') {
      const user = await User.findOne({token: parsedData.payload.token});
      if (user) {
        activeConnection.users.push(user);
      }
      console.log('Client connected!', parsedData.payload._id);
      ws.send(JSON.stringify(activeConnection));
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
