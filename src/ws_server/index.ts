import { WebSocketServer } from 'ws';
import { Router } from './router';
import { userDisconnect } from '../auth/user';
import { endGame } from '../room/room';

export const wsServer = (PORT: number) => {
  const server = new WebSocketServer({ port: PORT });
  console.log(`WebSocket server is listening on the ${PORT} port!`);
  server.on('connection', (ws) => {
    ws.on('message', async function message(data) {
      await Router(ws, data, broadcastMessage);
    });

    ws.on('close', () => {
      ws.close();
      endGame(ws, broadcastMessage);
      userDisconnect(ws);
    });

    ws.on('error', () => {
      console.log('Error!');
    });
  });

  function broadcastMessage(message: string) {
    server.clients.forEach((client) => {
      client.send(message);
    });
  }
};
