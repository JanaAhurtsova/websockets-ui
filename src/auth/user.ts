import { WebSocket } from 'ws';
import { Socket } from '../types/types';
import db from '../db/db';

export const getUser = (index: number) => {
  const user = db.users.find(item => item.index === index);
  return user;
}

export const userDisconnect = (ws: WebSocket) => {
  const { name } = ws as Socket;
  if (!name) {
    console.log('Unknown user are disconnected');
  } else {
    console.log(`User ${name} are disconnected`);
  }
};
