import { websocketResponse } from "../models/models";
import { Status } from "../types/enum";
import { Position, Ships } from "../types/types";

export const createGame = (gameId: number, index: number) => {
  const resp = websocketResponse.CreateGame;
  const newGame = {
    idGame: gameId,
    idPlayer: index
  }
  resp.data = JSON.stringify(newGame);
  return JSON.stringify(resp);
};

export const startGame = (ships: Ships[], index: number) => {
  const resp = websocketResponse.Start;
  resp.data = JSON.stringify({
    ships: ships,
    currentPlayerIndex: index
  });
  return JSON.stringify(resp);
};

export const turn = (index: number) => {
  const resp = websocketResponse.Turn;
  resp.data = JSON.stringify({
    currentPlayer: index
  });
  return JSON.stringify(resp);
}

export const attackResp = (position: Position, player: number, status: Status) => {
  const resp = websocketResponse.Attack;
  resp.data = JSON.stringify({
    position: position,
    currentPlayer: player,
    status: status
  });

  return JSON.stringify(resp);
}

export const finishGame = (winnerId: number ) => {
  const resp = websocketResponse.Finish;
  resp.data = JSON.stringify({
    winPlayer: winnerId
  });
  return JSON.stringify(resp);
}
