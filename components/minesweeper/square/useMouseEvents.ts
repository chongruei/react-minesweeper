import { MouseEventHandler, TouchEventHandler, useState } from "react";
import { useGameStatus } from "../hooks/useMinesweeperContext";
import { useMinesweeperSlice } from "../hooks/useMinesweeperSlice";
import { Square, MouseBehavior } from "../interface";
import { isAbleToSetFlag } from "../utils";

export const useSquareMouseEvents = (square: Square, squareIndex: number) => {
  const gameStatus = useGameStatus();
  const [lastTouchTime, setLastTouchTime] = useState<number>(
    new Date().getTime()
  );

  const {
    openSquare,
    setFlag,
    setMouseBehavior,
    resetMouseBehavior,
    moveMousePosition,
  } = useMinesweeperSlice();

  const { flagged } = square;

  const handleSetFlag = () => {
    if (isAbleToSetFlag(square, gameStatus)) {
      setFlag(squareIndex, !flagged);
    }
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

  // support mobile devices
  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setLastTouchTime(new Date().getTime());
    setMouseBehavior(squareIndex, MouseBehavior.SINGLE);
  };

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (new Date().getTime() - lastTouchTime > 300) {
      handleSetFlag();
    } else {
      openSquare();
    }
    resetMouseBehavior();
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  };
};
