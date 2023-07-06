import { WebSocketServer } from 'ws';
import { Router } from './router';

export const wsServer = () => {
  const server = new WebSocketServer({ port: 3000 });
  server.on('connection', (ws) => {
    ws.on('message', async function message(data) {
      await Router(ws, data, broadcastMessage);
    });

    ws.on('close', () => {
      ws.close();
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
