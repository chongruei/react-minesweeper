import { FC, useEffect, useReducer } from "react";
import {
  initMinesweeperValue,
  MinesweeperContext,
} from "./context/minesweeperContext";
import { minesweeperReducer } from "./context/minesweeperReducer";
import { useGameConig, useGameStatus } from "./hooks/useMinesweeperContext";
import { useMinesweeperSlice } from "./hooks/useMinesweeperSlice";
import { IMinesweeperConfig } from "./interface";
import { Board } from "./board";
import { Toolbar } from "./toolbar/toolbar";

const withMinesweeperWrapper = (
  Minesweeper: FC<IMinesweeperConfig>
): FC<IMinesweeperConfig> => {
  const MineSweeper: FC<IMinesweeperConfig> = ({ ...props }) => {
    const [state, dispatch] = useReducer(
      minesweeperReducer,
      initMinesweeperValue
    );
    return (
      <MinesweeperContext.Provider value={{ state, dispatch }}>
        <Minesweeper {...props} />
      </MinesweeperContext.Provider>
    );
  };

  return MineSweeper;
};

const MinesweeperView: FC<IMinesweeperConfig> = ({ columns, rows, mines }) => {
  const gameConfig = useGameConig();
  const gameStatus = useGameStatus();
  const { newGame } = useMinesweeperSlice();

  useEffect(() => {
    if (
      columns !== gameConfig.columns ||
      rows !== gameConfig.rows ||
      mines !== gameConfig.mines
    ) {
      // TODO
      console.info("new game");
    }
  }, [gameConfig, columns, rows, mines]);

  return (
    <div className="rounded-md overflow-hidden">
      <Toolbar />
      <Board />
    </div>
  );
};

export const Minesweeper = withMinesweeperWrapper(MinesweeperView);
