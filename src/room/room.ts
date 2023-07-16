import { websocketResponse } from '../models/models';
import { Room, Socket } from '../types/types';
import db from '../db/db';
import { getUser } from '../auth/user';
import { createGame, finishGame } from '../game/serverResponse';
import WebSocket from 'ws';
import { updateWinners, winnersUpdate } from '../winners/winners';
import { getNextPlayer } from '../game/game';

let indexRoom = 0;

export const createRoom = (ws: Socket) => {
  const room = getRoomByUserIndex(ws.index);

  if (room) {
    return;
  }

  const newRoom: Room = {
    roomId: indexRoom,
    roomUsers: [],
    ships: new Map(),
    shots: {},
    shipsData: new Map(),
  };

  indexRoom++;
  const user = getUser(ws.index);
  newRoom.roomUsers.push({ name: user.name, index: user.index });
  db.rooms.push(newRoom);
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

export const getRoomByUserIndex = (index: number) => {
  const room = db.rooms.find(({ roomUsers }) =>
    roomUsers.find((roomUser) => roomUser.index === index)
  );
  return room;
};

export const deleteRoom = (roomId: number) => {
  db.rooms = db.rooms.filter((room) => room.roomId !== roomId);
  return db.rooms;
};

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
  room.roomUsers.forEach((user) => {
    const game = createGame(room.roomId, user.index);
    const player = getUser(user.index);
    player.ws.send(game);
  });
};

export const endGame = (ws: WebSocket, broadcastMessage: (message: string) => void) => {
  const playerId = (ws as Socket).index;
  const room = getRoomByUserIndex(playerId);
  const { roomId } = room;
  if (room) {
    const winner = getNextPlayer(room, playerId);
    const winnerWS = getUser(winner);
    updateWinners(winner);
    const result = winnersUpdate();
    winnerWS.ws.send(result);
    const finish = finishGame(winner);
    broadcastMessage(finish);
    deleteRoom(roomId);
  }
};
