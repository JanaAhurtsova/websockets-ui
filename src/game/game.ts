import { WebSocket } from 'ws';
import { getUser } from '../auth/user';
import { getRoom, getRoomByUserIndex } from '../room/room';
import { Status } from '../types/enum';
import { Position, Room, ShipData, Socket } from '../types/types';
import { updateWinners, winnersUpdate } from '../winners/winners';
import { attackResp, finishGame, startGame, turn } from './serverResponse';

let currentUserId: number;

export const addShips = (data: string) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data);
  const room = getRoom(gameId);

  if (room.ships.size === 0) {
    currentUserId = indexPlayer;
  }

  room.ships.set(indexPlayer, ships);

  if (room.ships.size === 2) {
    createShipsData(room);

    room.roomUsers.forEach((user) => {
      const start = startGame(room.ships.get(user.index), user.index);
      const playerTurn = turn(currentUserId);
      const player = getUser(user.index);

      player.ws.send(start);
      player.ws.send(playerTurn);

      console.log(`Response for add_ships: ${start}`);
      console.log(`Turn: ${playerTurn}`);
    });
  }
};

export const attack = (data: string) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data);

  const room = getRoom(gameId);
  const position = x && y ? { x, y } : generateRandomShot(gameId, indexPlayer);
  const enemyId = getNextPlayer(room, indexPlayer);
  const { status, endOfTheGame, winnerId } = getStatus(gameId, indexPlayer, enemyId, position);

  if (currentUserId !== indexPlayer) {
    return endOfTheGame;
  }

  room.roomUsers.forEach((user) => {
    const player = getUser(user.index);
    const attackResult = attackResp(position, indexPlayer, status);
    player.ws.send(attackResult);
    console.log(`Response for attack: ${attackResult}`);

    if (status === Status.MISS) {
      const playerTurn = turn(enemyId);
      player.ws.send(playerTurn);
      currentUserId = enemyId;
      console.log(`Turn: ${playerTurn}`);
    } else {
      const playerTurn = turn(indexPlayer);
      player.ws.send(playerTurn);
      console.log(`Turn: ${playerTurn}`);
    }

    if (endOfTheGame) {
      updateWinners(winnerId);
      const res = finishGame(winnerId);
      player.ws.send(res);
      console.log(`Response for finish: ${attackResult}`);
    }
  });

  return endOfTheGame;
};

function getStatus(roomId: number, indexPlayer: number, enemyId: number, position: Position) {
  const room = getRoom(roomId);
  let status: Status = Status.MISS;
  const enemyShips = room.shipsData.get(enemyId);

  const updatedShipsData = enemyShips.map((ship) => {
    let { lengthAfterShot, coords } = ship;

    if (coords.some((coord) => coord.x === position.x && coord.y === position.y)) {
      lengthAfterShot--;

      if (lengthAfterShot === 0) {
        status = Status.KILLED;
        const player = getUser(indexPlayer);
        const enemy = getUser(enemyId);

        ship.coords.forEach((coord) => {
          const result = attackResp(coord, indexPlayer, status);
          player.ws.send(result);
          enemy.ws.send(result);
        });
      } else {
        status = Status.SHOT;
      }
    }
    return { lengthAfterShot, coords };
  });

  room.shipsData.set(enemyId, updatedShipsData);

  const endOfTheGame = checkEndOfTheGame(room, enemyId);
  const winnerId = indexPlayer;

  return { status, endOfTheGame, winnerId };
}

function checkEndOfTheGame(room: Room, enemyId: number) {
  const isEndGame = room.shipsData
    .get(enemyId)
    .every(({ lengthAfterShot }) => lengthAfterShot === 0);
  return isEndGame ? true : false;
}

function getNextPlayer(room: Room, currentPlayer: number) {
  const { index } = room.roomUsers.find(({ index }) => index !== currentPlayer);
  return index;
}

function generateRandomShot(gameId: number, indexPlayer: number) {
  const room = getRoom(gameId);

  const position = {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  };

  if (!room.shots[indexPlayer]) {
    room.shots[indexPlayer] = [];
  }

  if (
    room.shots[indexPlayer] &&
    room.shots[indexPlayer].some((shot) => shot.x === position.x && shot.y === position.y)
  ) {
    generateRandomShot(gameId, indexPlayer);
  }

  room.shots[indexPlayer].push(position);

  return position;
}

function createShipsData(room: Room) {
  room.ships.forEach((ships, playerId) => {
    const playerShipsData: ShipData[] = [];
    ships.forEach((ship) => {
      const shipData: ShipData = {
        lengthAfterShot: ship.length,
        coords: [],
      };
      for (let i = 0; i < ship.length; i++) {
        shipData.coords.push({
          x: ship.direction ? ship.position.x : ship.position.x + i,
          y: ship.direction ? ship.position.y + i : ship.position.y,
        });
      }
      playerShipsData.push(shipData);
    });
    room.shipsData.set(playerId, playerShipsData);
  });
}

export const endGame = (ws: WebSocket, broadcastMessage: (message: string) => void) => {
  const playerId = (ws as Socket).index;
  const room = getRoomByUserIndex(playerId);
  if (room) {
    const winner = getNextPlayer(room, playerId);
    const winnerWS = getUser(winner);
    updateWinners(winner);
    const result = winnersUpdate();
    winnerWS.ws.send(result);
    const finish = finishGame(winner);
    broadcastMessage(finish);
  }
}
