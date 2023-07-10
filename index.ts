import * as dotenv from 'dotenv';
import { httpServer } from "./src/http_server/index";
import { wsServer } from './src/ws_server';

dotenv.config();

const HTTP_PORT = Number(process.env.HTTP_PORT) | 8181;
const PORT = 3000;

wsServer(PORT);
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
