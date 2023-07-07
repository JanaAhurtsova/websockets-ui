import WebSocket from "ws";
import { websocketResponse } from "../models/models";
import { getRoom } from "../room/room";
import { Ships } from "../types/types";

const ships: Map<number, Ships[]> = new Map();
let currentIndex: number;

export const createGame = (gameId: number, index: number) => {
  const resp = websocketResponse.CreateGame;
  const newGame = {
    idGame: gameId,
    idPlayer: index
  }
  resp.data = JSON.stringify(newGame);
  return JSON.stringify(resp);
}

export const addShips = (data: string) => {
  const parseData = JSON.parse(data);
  const room = getRoom(parseData.gameId);
  if(!room.ships) {
    currentIndex = parseData.indexPlayer;
  }
  ships.set(parseData.indexPlayer, parseData.ships);
  room.ships = ships;
  console.log(room)
  if (room.ships.size === 2) {
    room.ws.forEach((ws) => {
      const start = startGame(room.ships.get(ws.index), currentIndex);
      ws.send(start)
    });
  }
}

export const startGame = (ships: Ships[], index: number) => {
  const resp = websocketResponse.Start;
  resp.data = JSON.stringify({
    ships: ships,
    currentPlayerIndex: index
  });

  return JSON.stringify(resp);
}
