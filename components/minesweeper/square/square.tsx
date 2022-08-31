import { FC } from "react";
import classnames from "classnames";
import { useGameConig, useGameStatus } from "../hooks/useMinesweeperContext";
import { GameStatus, Square as SquareType } from "../interface";
import { useMinesweeperSlice } from "../hooks/useMinesweeperSlice";
import { isMine } from "../utils";

import styles from "./square.module.scss";

interface ISquare {
  square: SquareType;
  squareIndex: number;
}

export const Square: FC<ISquare> = ({ square, squareIndex }) => {
  const { startGame, openSquare } = useMinesweeperSlice();
  const { columns } = useGameConig();
  const gameStatus = useGameStatus();

  const handleClickSquare = (squareIdx: number) => {
    if (gameStatus === GameStatus.NEW) {
      startGame(squareIdx);
    }

    if (gameStatus === GameStatus.START) {
      openSquare(squareIdx);
    }
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1:
        return "#3171b0";
      case 2:
        return "#4d8340";
      case 3:
        return "#ae4134";
      case 4:
        return "#7d308b";
      case 5:
        return "#fbbf24";
      case 6:
        return "#475569";
      case 7:
        return "#831843";
      // lucky?
      case 8:
        return "#f0fdfa";
    }
  };

  const backgroundImg =
    gameStatus === GameStatus.LOSE && isMine(square.state)
      ? 'url("/bomb.png")'
      : "none";

  const isDark =
    columns % 2 === 1
      ? squareIndex % 2 === 0
      : ((squareIndex % 2) + ~~(squareIndex / columns)) % 2 === 0;

  return (
    <div
      style={{ backgroundImage: backgroundImg }}
      className={classnames(styles.square, {
        "bg-[#a9d751]": !isDark,
        "bg-[#a2d049]": isDark,
        "bg-[#e4c29f]": square.visited && !isDark,
        "bg-[#d7b899]": square.visited && isDark,
        "bg-red-600": gameStatus === GameStatus.LOSE && isMine(square.state),
      })}
      onClick={() => handleClickSquare(squareIndex)}
    >
      {square.surroundindMines > 0 && (
        <span
          className="font-extrabold text-2xl"
          style={{ color: getNumberColor(square.surroundindMines) }}
        >
          {square.surroundindMines}
        </span>
      )}
    </div>
  );
};
