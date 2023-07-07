import WebSocket, { RawData } from "ws";
import { websocketResponse } from "../models/models";
import { authValidate } from "./validation";
import db from '../db/db';
import { Socket } from "../types/types";

let index = 0;

export const registerUser = (ws: WebSocket, data: string) => {
  const user = JSON.parse(data);
  const resp = websocketResponse.Reg;

  if(!authValidate(user)) {
    resp.data = JSON.stringify({
      name: '',
      index: 0,
      error: true,
      errorText: 'Name or password is invalid'
    });
  }

  const player = db.users.find(player => player.name === user.name);
  if (player) {
    if(player.password === user.password) {
      resp.data = JSON.stringify({
        name: player.name,
        index: player.index,
        error: false,
        errorText: ''
      });
    } else {
      resp.data = JSON.stringify({
        name: player.name,
        index: player.index,
        error: true,
        errorText: 'Invalid password'
      });
    }
  } else {
    resp.data = JSON.stringify({
      name: user.name,
      index: index,
      error: false,
      errorText: ''
    });
  
    index++;
    (ws as Socket).index = index;
    (ws as Socket).name = user.name;
    db.users.push({ name: user.name, index: index, password: user.password });
  }
  
  return resp;
};

export const getUser = (index: number) => {
  const user = db.users.find(item => item.index === index);
  return user;
}
