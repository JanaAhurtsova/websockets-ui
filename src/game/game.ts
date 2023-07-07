import { websocketResponse } from "../models/models";

let idGame = 0;

export const createGame = (index: number) => {
  const resp = websocketResponse.CreateGame;
  const newGame = {
    idGame: idGame,
    idPlayer: index
  }
  idGame++;
  resp.data = JSON.stringify(newGame);
  return JSON.stringify(resp);
}
