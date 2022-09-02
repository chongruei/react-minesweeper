import { FC } from "react";
import classnames from "classnames";
import { useGameConig, useGameStatus } from "../hooks/useMinesweeperContext";
import {
  GameStatus,
  Square as SquareType,
  SquareState,
  VisitState,
} from "../interface";
import { getNumberColor, isMine } from "../utils";
import { useSquareMouseEvents } from "./useMouseEvents";

import styles from "./square.module.scss";

interface ISquare {
  square: SquareType;
  squareIndex: number;
}

export const Square: FC<ISquare> = ({ square, squareIndex }) => {
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useSquareMouseEvents(square, squareIndex);
  const { columns } = useGameConig();
  const gameStatus = useGameStatus();
  const { state, surroundindMines, visited } = square;

  const getBGImage = () => {
    if (gameStatus === GameStatus.LOSE && isMine(square)) {
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
        "bg-red-600": gameStatus === GameStatus.LOSE && isMine(square),
        "opacity-50": visited === VisitState.VISITING,
      })}
      // deprecate: onClick={handleClickSquare}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
