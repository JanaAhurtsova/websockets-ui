import { WebSocketServer } from 'ws';
import { Router } from './router';
import { userDisconnect } from '../auth/user';

export const wsServer = (PORT: number) => {
  const server = new WebSocketServer({ port: PORT });
  server.on('connection', (ws) => {
    console.log(`WebSocket server is listening on the ${PORT} port!`);
    ws.on('message', async function message(data) {
      await Router(ws, data, broadcastMessage);
    });

    ws.on('close', () => {
      ws.close();

      userDisconnect(ws);
    });
    
    ws.on('error', () => {
      console.log('Error!');
    });
  });

  function broadcastMessage (message: string) {
    server.clients.forEach((client) => {
      client.send(message);
    });
  }
};
