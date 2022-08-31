import { Dispatch } from "react";

export enum GameStatus {
  NEW = "new",
  START = "start",
  LOSE = "lose",
  WIN = "win",
}

export enum SquareState {
  // unrevealed empty square
  UNREVEALED_SQUARE = 1,

  // revealed blank square
  REVEALED_SQUARE = 2,

  // unrevealed mine
  UNREVEALED_MINE = 3,

  // revealed mine
  REVEALED_MINE = 4,
}

export enum MinesweeperActionType {
  NEW = "new",
  START = "start",
  OPEN_SQUARE = "openSquare",
  LOSE = "lose",
  WIN = "win",
}

export type MinesweeperAction = {
  type: MinesweeperActionType;
  payload?: any;
};

export type Square = {
  surroundindMines: number;
  visited: boolean;
  state: SquareState;
};

export interface IMinesweeperConfig {
  columns: number;
  rows: number;
  mines: number;
}

export interface IMinesweeperState extends IMinesweeperConfig {
  gameStatus: GameStatus;
  gameArray: Square[];
}

export interface IMinesweeperContext {
  state: IMinesweeperState;
  dispatch: Dispatch<MinesweeperAction>;
}
