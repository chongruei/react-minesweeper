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
  SET_FLAG = "setFlag",
  REMOVE_FLAG = "removeFlag",
  LOSE = "lose",
  WIN = "win",
}

type MinesweeperNewAction = {
  type: MinesweeperActionType.NEW;
  payload?: {
    columns: number;
    rows: number;
    mines: number;
  };
};

type MinesweeperStartAction = {
  type: MinesweeperActionType.START;
  payload: {
    squareIdx: number;
  };
};

type MinesweeperOpenSquareAction = {
  type: MinesweeperActionType.OPEN_SQUARE;
  payload: {
    squareIdx: number;
  };
};

type MinesweeperSetFlagAction = {
  type: MinesweeperActionType.SET_FLAG;
  payload: {
    squareIdx: number;
  };
};

type MinesweeperRemoveFlagAction = {
  type: MinesweeperActionType.REMOVE_FLAG;
  payload: {
    squareIdx: number;
  };
};

export type MinesweeperAction =
  | MinesweeperNewAction
  | MinesweeperStartAction
  | MinesweeperOpenSquareAction
  | MinesweeperSetFlagAction
  | MinesweeperRemoveFlagAction;

export type Square = {
  surroundindMines: number;
  visited: boolean;
  flagged: boolean;
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
