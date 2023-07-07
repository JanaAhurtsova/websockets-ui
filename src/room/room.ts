import { websocketResponse } from '../models/models';
import { Room, Socket } from '../types/types';
import db from '../db/db';
import { getUser } from '../auth/userAuth';
import { createGame } from '../game/game';
import { WebSocket } from 'ws';

let indexRoom = 0;

export const createRoom = (ws: Socket) => {
  const room = getRoomByUserIndex(ws.index);
  if (room) {
    return;
  }
  const newRoom: Room = {
    roomId: indexRoom,
    roomUsers: [],
    ws: [ws],
  };

  indexRoom++;
  const user = getUser(ws.index);
  newRoom.roomUsers.push({ name: user.name, index: user.index });
  db.rooms.push(newRoom);

  return newRoom;
};

export const getAvailableRooms = () => {
  const rooms = db.rooms
    .filter((room) => room.roomUsers.length < 2)
    .map(({ roomId, roomUsers }) => ({ roomId, roomUsers }));
  return rooms;
};

export const getRoom = (index: number) => {
  const room = db.rooms.find((room) => room.roomId === index);
  return room;
};

function getRoomByUserIndex(index: number) {
  const room = db.rooms.find(({ roomUsers }) =>
    roomUsers.find((roomUser) => roomUser.index === index)
  );
  return room;
}

export const updateRoom = () => {
  const resp = websocketResponse.UpdateRoom;
  const rooms = getAvailableRooms();
  resp.data = JSON.stringify(rooms);
  return JSON.stringify(resp);
};

export const addUserToRoom = (ws: Socket, data: string) => {
  const index = JSON.parse(data).indexRoom;
  const room = getRoom(index);

  if (!room) {
    return;
  }

  if (room.roomUsers.find((user) => user.index === ws.index)) {
    return;
  }

  room.roomUsers.push({ name: ws.name, index: ws.index });
  room.ws.push(ws);
  room.ws.forEach((user) => {
    const game = createGame(room.roomId, user.index);
    user.send(game);
  });
};
