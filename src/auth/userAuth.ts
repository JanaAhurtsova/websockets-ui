import WebSocket, { RawData } from "ws";
import { websocketResponse } from "../models/models";
import { authValidate } from "./validation";
import db from '../db/db';
import { Socket } from "../types/types";

let index = 0;

export const registerUser = (ws: WebSocket, data: string) => {
  const resp = websocketResponse.Reg;

  const user = getUserData(ws, data);
  resp.data = user;
  
  return resp;
};

function getUserData (ws: WebSocket, data: string) {
  const { name, password } = JSON.parse(data);
  if(!authValidate({ name, password })) {
    return JSON.stringify({
      name: '',
      index: 0,
      error: true,
      errorText: 'Name or password is invalid'
    });
  }

  const player = db.users.find(player => player.name === name);
  if (player) {
    if(player.password === password) {
      return JSON.stringify({
        name: player.name,
        index: player.index,
        error: false,
        errorText: ''
      });
    } else {
      return JSON.stringify({
        name: player.name,
        index: player.index,
        error: true,
        errorText: 'Invalid password'
      });
    }
  }

  const user = JSON.stringify({
    name: name,
    index: index,
    error: false,
    errorText: ''
  });

  (ws as Socket).index = index;
  (ws as Socket).name = name;
  db.users.push({ name: name, index: index, password: password, ws: ws as Socket });
  index++;
  db.winners.push({ name: name, wins: 0 });
  return user
}

