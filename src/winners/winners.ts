import { getUser } from '../auth/user';
import db from '../db/db';
import { websocketResponse } from '../models/models';

export const updateWinners = (winnerId: number) => {
  const user = getUser(winnerId);
  const winnerUpdate = db.winners.map((winner) => {
    winner.name === user.name ? winner.wins++ : winner.wins
    return winner;
  });
  db.winners = winnerUpdate
  db.winners.sort((a, b) => a.wins - b.wins);
};

export const winnersUpdate = () => {
  const resp = websocketResponse.Win;
  resp.data = JSON.stringify(db.winners);
  return JSON.stringify(resp);
}
