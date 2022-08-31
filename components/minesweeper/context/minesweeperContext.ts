import { createContext } from "react";
import { DEFAULT_COLS, DEFAULT_MINES, DEFAULT_ROWS } from "config";
import {
  GameStatus,
  IMinesweeperContext,
  IMinesweeperState,
  MouseBehavior,
  SquareState,
  VisitState,
} from "../interface";

export const initMinesweeperValue: IMinesweeperState = {
  columns: DEFAULT_COLS,
  rows: DEFAULT_ROWS,
  mines: DEFAULT_MINES,
  openIndex: -1,
  mouseBehavior: MouseBehavior.NONE,
  gameStatus: GameStatus.NEW,
  gameArray: Array(DEFAULT_ROWS * DEFAULT_COLS).fill({
    surroundindMines: 0,
    visited: VisitState.NONE,
    flagged: false,
    state: SquareState.UNREVEALED_SQUARE,
  }),
};

export const MinesweeperContext = createContext<IMinesweeperContext>(
  {} as IMinesweeperContext
);
