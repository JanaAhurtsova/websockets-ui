import { websocketResponse } from "../models/models";
import { Room, Socket } from "../types/types";
import db from '../db/db';
import { getUser } from "../auth/userAuth";

let indexRoom = 0;

export const createRoom = (ws: Socket) => {
  const room = getRoomByUserIndex(ws.index);
  if(room) {
    return;
  }
  const newRoom: Room = {
    roomId: indexRoom,
    roomUsers: [],
  };

  indexRoom++;
  const user = getUser(ws.index);
  newRoom.roomUsers.push(user);
  db.rooms.push(newRoom);

  return newRoom;
}

export const getAvailableRooms = () => {
  const rooms = db.rooms.filter(room => room.roomUsers.length < 2).map(room => room);
  return rooms;
}

export const getRoom = (index: number) => {
  const room = db.rooms.find(room => room.roomId === index);
  return room;
}

function getRoomByUserIndex (index: number) {
  const room = db.rooms.find(({ roomUsers }) => roomUsers.find((roomUser) => roomUser.index === index));
  return room;
}

export const updateRoom = () => {
  const resp = websocketResponse.UpdateRoom;
  const rooms = getAvailableRooms();
  resp.data = JSON.stringify(rooms);
  return JSON.stringify(resp);
}

export const addUserToRoom = () => {

}
