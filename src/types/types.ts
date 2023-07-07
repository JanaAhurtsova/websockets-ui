import { WebSocket } from "ws";

export interface AuthReq {
    type: 'reg';
    data: AuthData;
    id: number;
}

export interface AuthData {
  name: string;
  password: string;
}

export interface AuthResp {
  type: 'reg';
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
}

export interface Request {
  type: Type,
  data: string,
  id: number
}

type Type = 'reg'
| 'update_winners'
| 'create_room'
| 'create_game'
| 'update_room'
| 'attack'
| 'turn'
| 'finish'
| 'add_user_to_room'

export interface Room {
  roomId: number,
  roomUsers: User[]
};

interface User {
  name: string;
  index: number;
  ws: Socket;
}

export interface Player {
  name: string;
  index: number;
  password: string;
}

export interface Socket extends WebSocket, Player {};
