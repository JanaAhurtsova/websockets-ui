import WebSocket, { RawData } from 'ws';
import { registerUser } from '../auth/userAuth';
import { Types } from '../types/enum';
import { addUserToRoom, createRoom, deleteRoom, updateRoom } from '../room/room';
import { Socket } from '../types/types';
import { addShips, attack } from '../game/game';
import { winnersUpdate } from '../winners/winners';

export const Router = async (
  ws: WebSocket,
  message: RawData,
  broadcastMessage: (message: string) => void
) => {
  if (!message) {
    return;
  }

  const parseData = JSON.parse(message.toString());
  const data = parseData.data;

  switch (parseData.type) {
    case Types.REG: {
      const user = registerUser(ws, data);
      ws.send(JSON.stringify(user));
      console.log(`Response for ${parseData.type}: ${JSON.stringify(user)}`);

      const rooms = updateRoom();
      ws.send(rooms);
      console.log(`Response for ${parseData.type}: ${rooms}`);

      const winners = winnersUpdate();
      broadcastMessage(winners);
      console.log(`Response for ${parseData.type}: ${winners}`);
      break;
    }
    case Types.CREATE_ROOM: {
      createRoom(ws as Socket);
      const rooms = updateRoom();
      broadcastMessage(rooms);
      console.log(`Response for ${parseData.type}: ${rooms}`);

      break;
    }
    case Types.ADD_PLAYER: {
      addUserToRoom(ws as Socket, data);
      const rooms = updateRoom();
      broadcastMessage(rooms);
      console.log(`Response for ${parseData.type}: ${rooms}`);

      break;
    }
    case Types.ADD_SHIP: {
      addShips(data);
      break;
    }
    case Types.ATTACK:
    case Types.RANDOM_ATTACK: {
      const { endOfTheGame, roomId } = attack(data);
      if (endOfTheGame) {
        const winners = winnersUpdate();
        broadcastMessage(winners);
        deleteRoom(roomId);
      }
      break;
    }

    default: {
      console.log('Invalid command');
    }
  }
};
