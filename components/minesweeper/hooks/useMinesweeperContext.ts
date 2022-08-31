import { Dispatch, useContext } from "react";
import { MinesweeperContext } from "../context/minesweeperContext";
import {
  GameStatus,
  IMinesweeperConfig,
  MinesweeperAction,
  MouseBehavior,
  Square,
} from "../interface";

export const useDispatch = (): Dispatch<MinesweeperAction> =>
  useContext(MinesweeperContext).dispatch;

export const useMouseBehavior = (): MouseBehavior =>
  useContext(MinesweeperContext).state.mouseBehavior;

export const useGameArray = (): Square[] =>
  useContext(MinesweeperContext).state.gameArray;

export const useGameStatus = (): GameStatus =>
  useContext(MinesweeperContext).state.gameStatus;

export const useGameConig = (): IMinesweeperConfig => {
  const { rows, columns, mines } = useContext(MinesweeperContext).state;
  return {
    mines,
    rows,
    columns,
  };
};
