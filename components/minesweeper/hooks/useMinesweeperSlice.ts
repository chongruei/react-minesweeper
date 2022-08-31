import { GameStatus, MouseBehavior } from "./../interface";
import { Callback } from "@interface/common";
import { MinesweeperActionType } from "../interface";
import {
  useDispatch,
  useGameStatus,
  useMouseBehavior,
} from "./useMinesweeperContext";

type UseMinesweeperSlice = {
  newGame: Callback;
  openSquare: () => void;
  setFlag: (squareIdx: number, remove: boolean) => void;
  setMouseBehavior: (squareIdx: number, mouseBehavior: MouseBehavior) => void;
  resetMouseBehavior: () => void;
  moveMousePosition: (squareIdx: number) => void;
};

export const useMinesweeperSlice = (): UseMinesweeperSlice => {
  const dispatch = useDispatch();
  const gameStatus = useGameStatus();
  const mouseBehavior = useMouseBehavior();

  const newGame = () => {
    dispatch({ type: MinesweeperActionType.NEW });
  };

  const openSquare = () => {
    if (
      gameStatus === GameStatus.NEW &&
      mouseBehavior === MouseBehavior.SINGLE
    ) {
      dispatch({ type: MinesweeperActionType.START });
    } else if (gameStatus === GameStatus.START) {
      dispatch({
        type:
          mouseBehavior === MouseBehavior.SINGLE
            ? MinesweeperActionType.OPEN_SQUARE
            : MinesweeperActionType.OPEN_SQUARES,
      });
    }
  };

  const setFlag = (squareIdx: number, install: boolean) => {
    dispatch({
      type: MinesweeperActionType.SET_FLAG,
      payload: { squareIdx, install },
    });
  };

  const setMouseBehavior = (squareIdx: number, behavior: MouseBehavior) => {
    if (gameStatus === GameStatus.START || gameStatus === GameStatus.NEW) {
      dispatch({
        type: MinesweeperActionType.SET_MOUSE_BEHAVIOR,
        payload: { squareIdx, behavior },
      });
    }
  };

  const resetMouseBehavior = () => {
    dispatch({
      type: MinesweeperActionType.SET_MOUSE_BEHAVIOR,
      payload: { squareIdx: -1, behavior: MouseBehavior.NONE },
    });
  };

  const moveMousePosition = (squareIdx: number) => {
    if (mouseBehavior !== MouseBehavior.NONE)
      dispatch({
        type: MinesweeperActionType.SET_MOUSE_BEHAVIOR,
        payload: { squareIdx, behavior: mouseBehavior },
      });
  };

  return {
    newGame,
    openSquare,
    setFlag,
    setMouseBehavior,
    resetMouseBehavior,
    moveMousePosition,
  };
};
