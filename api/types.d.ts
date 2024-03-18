import {Model} from "mongoose";
import {WebSocket} from 'ws';

export interface UserFields {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface UserMethods {
  generateToken(): void;
  checkPassword(password: string): Promise<boolean>;
}

export type UserModel = Model<UserFields, unknown, UserMethods>;

export interface ActiveConnection {
  [token: string]: WebSocket;
}