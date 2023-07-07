import WebSocket, { RawData } from "ws";
import { registerUser } from "../auth/userAuth";
import { Types } from "../types/enum";
import { addUserToRoom, createRoom, updateRoom } from "../room/room";
import { Socket } from "../types/types";
import { addShips, startGame } from "../game/game";

export const Router = async (ws: WebSocket, message: RawData, broadcastMessage: (message: string) => void) => {
  if(!message) {
    return;
  }

  const parseData = JSON.parse(message.toString());
  const data = parseData.data;

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
      addUserToRoom(ws as Socket, data);
      const rooms = updateRoom();
      broadcastMessage(rooms);
      break;
    }
    case Types.ADD_SHIP: {
      addShips(data);
      break;
    }
    default: {
      console.log('Invalid command');
    }
  };
};
