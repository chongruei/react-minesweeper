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

export enum VisitState {
  NONE = 1,
  VISITING = 2,
  VISITED = 3,
}

export enum MinesweeperActionType {
  NEW = "new",
  START = "start",
  OPEN_SQUARE = "openSquare",
  OPEN_SQUARES = "openSquares",
  SET_FLAG = "setFlag",
  SET_MOUSE_BEHAVIOR = "setMouseBehavior",
  LOSE = "lose",
  WIN = "win",
}

export enum MouseBehavior {
  NONE = "none",
  SINGLE = "single",
  MULTI = "multi",
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
};

type MinesweeperOpenSquareAction = {
  type: MinesweeperActionType.OPEN_SQUARE;
};

type MinesweeperOpenSquaresAction = {
  type: MinesweeperActionType.OPEN_SQUARES;
};

type MinesweeperSetFlagAction = {
  type: MinesweeperActionType.SET_FLAG;
  payload: {
    squareIdx: number;
    install: boolean;
  };
};

type MinesweeperSetMouseBehaviorAction = {
  type: MinesweeperActionType.SET_MOUSE_BEHAVIOR;
  payload: {
    squareIdx: number;
    behavior: MouseBehavior;
  };
};

export type MinesweeperAction =
  | MinesweeperNewAction
  | MinesweeperStartAction
  | MinesweeperOpenSquareAction
  | MinesweeperOpenSquaresAction
  | MinesweeperSetFlagAction
  | MinesweeperSetMouseBehaviorAction;

export type Square = {
  surroundindMines: number;
  visited: VisitState;
  flagged: boolean;
  state: SquareState;
};

export interface IMinesweeperConfig {
  columns: number;
  rows: number;
  mines: number;
}

export interface IMinesweeperState extends IMinesweeperConfig {
  openIndex: number;
  mouseBehavior: MouseBehavior;
  gameStatus: GameStatus;
  gameArray: Square[];
}

export interface IMinesweeperContext {
  state: IMinesweeperState;
  dispatch: Dispatch<MinesweeperAction>;
}
