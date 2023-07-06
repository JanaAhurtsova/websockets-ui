import WebSocket, { RawData } from "ws";
import { websocketResponse } from "../models/models";
import { authValidate } from "./validation";
import db from '../db/db';
import { Socket } from "../types/types";

let index = 0;

export const registerUser = (ws: WebSocket, data: RawData) => {
  const userData = data.toString();
  const parseData = JSON.parse(userData);
  const user = JSON.parse(parseData.data);
  const resp = websocketResponse.Reg;

  if(!authValidate(user)) {
    resp.data = JSON.stringify({
      name: '',
      index: 0,
      error: true,
      errorText: 'Name or password is invalid'
    });
  }

  resp.data = JSON.stringify({
    name: user.name,
    index: index,
    error: false,
    errorText: ''
  });

  index++;
  (ws as Socket).index = index;
  db.users.push({ name: user.name, index: index });
  return resp;
}

export const getUser = (index: number) => {
  const user = db.users.find(item => item.index === index);
  return user;
}
