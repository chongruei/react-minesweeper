import { FC, MouseEventHandler } from "react";
import classnames from "classnames";
import { useGameConig, useGameStatus } from "../hooks/useMinesweeperContext";
import { GameStatus, Square as SquareType, SquareState } from "../interface";
import { useMinesweeperSlice } from "../hooks/useMinesweeperSlice";
import { isMine, isRevealed } from "../utils";

import styles from "./square.module.scss";

interface ISquare {
  square: SquareType;
  squareIndex: number;
}

export const Square: FC<ISquare> = ({ square, squareIndex }) => {
  const { startGame, openSquare, setFlag, removeFlag } = useMinesweeperSlice();
  const { columns } = useGameConig();
  const gameStatus = useGameStatus();

  const { state, surroundindMines, flagged } = square;

  const handleClickSquare = () => {
    if (gameStatus === GameStatus.NEW) {
      startGame(squareIndex);
    }

    if (gameStatus === GameStatus.START) {
      openSquare(squareIndex);
    }
  };

  const handleSetFlag: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (isRevealed(state) || gameStatus !== GameStatus.START) {
      return;
    }
    if (!flagged) {
      setFlag(squareIndex);
    } else {
      removeFlag(squareIndex);
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

  const getBGImage = () => {
    if (gameStatus === GameStatus.LOSE && isMine(square.state)) {
      return 'url("/bomb.png")';
    }

    if (square.flagged) {
      return 'url("/flag.png")';
    }

    return "none";
  };

  const isDark =
    columns % 2 === 1
      ? squareIndex % 2 === 0
      : ((squareIndex % 2) + ~~(squareIndex / columns)) % 2 === 0;

  return (
    <div
      style={{ backgroundImage: getBGImage() }}
      className={classnames(styles.square, {
        "bg-[#a9d751]": !isDark,
        "bg-[#a2d049]": isDark,
        "bg-[#e4c29f]": state === SquareState.REVEALED_SQUARE && !isDark,
        "bg-[#d7b899]": state === SquareState.REVEALED_SQUARE && isDark,
        "bg-red-600": gameStatus === GameStatus.LOSE && isMine(state),
      })}
      onClick={handleClickSquare}
      onContextMenu={handleSetFlag}
    >
      {surroundindMines > 0 && (
        <span
          className="font-extrabold text-2xl"
          style={{ color: getNumberColor(surroundindMines) }}
        >
          {surroundindMines}
        </span>
      )}
    </div>
  );
};
