import { RawData } from "ws";
import { websocketResponse } from "../models/models";
import { Player } from "../types/types";
import { authValidate } from "./validation";

let users = new Set();
let index = 0;

export const addPlayer = (player: Player) => {
  return users.add(player);
}

export const registerUser = (data: RawData) => {
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

    return resp;
  }

  resp.data = JSON.stringify({
    name: user.name,
    index: index,
    error: false,
    errorText: ''
  });

  index++;
  users.add({ ...user, index: index });
  return resp;
}
