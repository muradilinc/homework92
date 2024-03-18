export interface User {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string;
}

export interface ValidationError {
  error: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface Message {
  _id: string;
  author: User;
  text: string;
}

export interface LoginChat {
  type: string;
  payload: {
    onlineUsers: User[],
    messages: Message[],
  };
}

export interface GetNewMessage {
  type: 'NEW_MESSAGE';
  payload: Message;
}

export type IncomingMessage = LoginChat | GetNewMessage;