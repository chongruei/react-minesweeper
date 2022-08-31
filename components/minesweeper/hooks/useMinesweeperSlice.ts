import { Callback } from "@interface/common";
import { MinesweeperActionType } from "../interface";
import { useDispatch } from "./useMinesweeperContext";

type UseMinesweeperSlice = {
  newGame: Callback;
  startGame: (squareIdx: number) => void;
  openSquare: (squareIdx: number) => void;
};

export const useMinesweeperSlice = (): UseMinesweeperSlice => {
  const dispatch = useDispatch();

  const newGame = () => {
    dispatch({ type: MinesweeperActionType.NEW });
  };

  const startGame = (squareIdx: number) => {
    dispatch({ type: MinesweeperActionType.START, payload: { squareIdx } });
  };

  const openSquare = (squareIdx: number) => {
    dispatch({
      type: MinesweeperActionType.OPEN_SQUARE,
      payload: { squareIdx },
    });
  };

  return {
    newGame,
    startGame,
    openSquare,
  };
};