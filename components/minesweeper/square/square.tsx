import { FC, MouseEventHandler } from "react";
import classnames from "classnames";
import { useGameConig, useGameStatus } from "../hooks/useMinesweeperContext";
import {
  GameStatus,
  MouseBehavior,
  Square as SquareType,
  SquareState,
  VisitState,
} from "../interface";
import { useMinesweeperSlice } from "../hooks/useMinesweeperSlice";
import { getNumberColor, isMine, isRevealed } from "../utils";

import styles from "./square.module.scss";

interface ISquare {
  square: SquareType;
  squareIndex: number;
}

export const Square: FC<ISquare> = ({ square, squareIndex }) => {
  const {
    openSquare,
    setFlag,
    setMouseBehavior,
    resetMouseBehavior,
    moveMousePosition,
  } = useMinesweeperSlice();
  const { columns } = useGameConig();
  const gameStatus = useGameStatus();

  const { state, surroundindMines, flagged, visited } = square;

  const handleSetFlag = () => {
    if (isRevealed(square) || gameStatus !== GameStatus.START) {
      return;
    }
    setFlag(squareIndex, !flagged);
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (e.button === 0 && e.buttons === 1) {
      // left
      setMouseBehavior(squareIndex, MouseBehavior.SINGLE);
    } else if (e.button === 2 && e.buttons === 2) {
      //right
      handleSetFlag();
    } else if (e.buttons > 2) {
      // middle
      setMouseBehavior(squareIndex, MouseBehavior.MULTI);
    }
  };

  const handleMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    openSquare();
    resetMouseBehavior();
  };

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    moveMousePosition(squareIndex);
  };

  const handleMouseLeave = () => {
    resetMouseBehavior();
  };

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
      // onClick={handleClickSquare}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
