import { WebSocketServer } from 'ws';
import { registerUser } from '../auth/userAuth';

export const wsServer = () => {
  const server = new WebSocketServer({ port: 3000 });
  server.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      const user = registerUser(data);
      console.log(user);
      ws.send(JSON.stringify(user));
  
    });

    ws.on('error', () => {
      console.log('Error!');
    })
  });
};

