import WebSocket, { RawData } from "ws";
import { registerUser } from "../auth/userAuth";
import { Types } from "../types/enum";
import { addUserToRoom, createRoom, updateRoom } from "../room/room";
import { Socket } from "../types/types";

export const Router = async (ws: WebSocket, data: RawData, broadcastMessage: (message: string) => void) => {
  if(!data) {
    return;
  }

  const parseData = JSON.parse(data.toString());
  switch(parseData.type) {
    case Types.REG: {
      const user = registerUser(ws, data);
      ws.send(JSON.stringify(user));

      const rooms = updateRoom();
      ws.send(rooms);
      break;
    }
    case Types.CREATE_ROOM: {
      createRoom(ws as Socket);
      const rooms = updateRoom();
      broadcastMessage(rooms);
      break;
    }
    case Types.ADD_PLAYER: {
      addUserToRoom(ws as Socket, parseData.data);
      const rooms = updateRoom();
      broadcastMessage(rooms);
      break;
    }
    default: {
      console.log('Invalid command');
    }
  };
};
