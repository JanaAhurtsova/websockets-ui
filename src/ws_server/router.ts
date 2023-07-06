import WebSocket, { RawData } from "ws";
import { registerUser } from "../auth/userAuth";
import { Types } from "../types/enum";
import { createRoom, updateRoom } from "../room/room";
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
      const room = createRoom(ws as Socket);
      if(room) {
        console.log(room)
        const rooms = updateRoom();
        broadcastMessage(rooms);
      }
      break;
    }
    case Types.ADD_PLAYER: {
      break;
    }
    default: {
      console.log('Invalid command');
    }
  };
};
