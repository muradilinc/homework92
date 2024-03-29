import { Model } from 'mongoose';
import { WebSocket } from 'ws';

export interface UserFields {
  _id: string;
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  isOnline: boolean;
}

export interface UserMethods {
  generateToken(): void;
  checkPassword(password: string): Promise<boolean>;
}

export type UserModel = Model<UserFields, unknown, UserMethods>;

export interface ActiveConnection {
  [token: string]: WebSocket;
}

export interface BroadcastMessage {
  type: string;
  payload: {
    author: UserFields;
    text: string;
  };
}
