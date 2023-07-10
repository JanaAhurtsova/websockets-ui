import { WebSocket } from 'ws';

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
  type: Type;
  data: string;
  id: number;
}

type Type =
  | 'reg'
  | 'update_winners'
  | 'create_room'
  | 'create_game'
  | 'update_room'
  | 'attack'
  | 'turn'
  | 'finish'
  | 'add_user_to_room';

export interface Room {
  roomId: number;
  roomUsers: User[];
  ships: Map<number, Ships[]>;
  shots: Shot;
  shipsData: Map<number, ShipData[]>
}

export interface Shot {
  [key: number]: Position[]
}

interface User {
  name: string;
  index: number;
}

export interface Player {
  name: string;
  index: number;
  password: string;
  ws: Socket;
}

export interface Socket extends WebSocket, Player {}

export interface Ships {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface Winner {
  name: string,
  wins: number
}

export interface Position {
  x: number,
  y: number
}

export interface ShipData {
  lengthAfterShot: number,
  coords: Position[]
}

