import { getUser } from '../auth/user';
import db from '../db/db';
import { websocketResponse } from '../models/models';

export const updateWinners = (winnerId: number) => {
  const user = getUser(winnerId);
  const updatedWins = db.winners.map(({ name, wins }) =>
    name === user.name ? { name, wins: wins + 1 } : { name, wins }
  );
  db.winners = updatedWins;
  db.winners.sort((a, b) => b.wins - a.wins).slice(10);
};

export const winnersUpdate = () => {
  const resp = websocketResponse.Win;
  resp.data = JSON.stringify(db.winners);
  return JSON.stringify(resp);
};
