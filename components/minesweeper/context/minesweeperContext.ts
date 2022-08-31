import { createContext } from "react";
import { DEFAULT_COLS, DEFAULT_MINES, DEFAULT_ROWS } from "config";
import {
  GameStatus,
  IMinesweeperContext,
  IMinesweeperState,
  SquareState,
} from "../interface";

export const initMinesweeperValue: IMinesweeperState = {
  columns: DEFAULT_COLS,
  rows: DEFAULT_ROWS,
  mines: DEFAULT_MINES,
  gameStatus: GameStatus.NEW,
  gameArray: Array(DEFAULT_ROWS * DEFAULT_COLS).fill({
    surroundindMines: 0,
    state: SquareState.UNREVEALED_SQUARE,
  }),
};

export const MinesweeperContext = createContext<IMinesweeperContext>(
  {} as IMinesweeperContext
);
