import {
  GameStatus,
  IMinesweeperState,
  MinesweeperAction,
  MinesweeperActionType,
  Square,
  SquareState,
} from "../interface";
import { isGameSet, isRevealed, openSurroundSquares } from "../utils";

export const minesweeperReducer = (
  state: IMinesweeperState,
  action: MinesweeperAction
): IMinesweeperState => {
  const { rows, columns, mines } = state;
  const { type, payload } = action;
  switch (type) {
    case MinesweeperActionType.NEW:
      return {
        ...state,
        gameStatus: GameStatus.NEW,
        gameArray: Array(rows * columns).fill({
          surroundindMines: 0,
          visited: false,
          flagged: false,
          state: SquareState.UNREVEALED_SQUARE,
        }),
      };

    case MinesweeperActionType.START: {
      const { squareIdx } = payload;

      // mine array
      const minesArray: Square[] = Array(mines).fill({
        surroundindMines: 0,
        visited: false,
        flagged: false,
        state: SquareState.UNREVEALED_MINE,
      });

      // blank array = rows * columns - mines amount - square (first square shouldn't be mine)
      const blankArray: Square[] = Array(rows * columns - mines - 1).fill({
        surroundindMines: 0,
        visited: false,
        flagged: false,
        state: SquareState.UNREVEALED_SQUARE,
      });

      // random mine positions
      const gameArray = [...minesArray, ...blankArray].sort(
        () => Math.random() - 0.5
      );

      // insert first square to game array by index
      gameArray.splice(squareIdx, 0, {
        surroundindMines: 0,
        visited: false,
        flagged: false,
        state: SquareState.REVEALED_SQUARE,
      });

      const newGameArray: Square[] = JSON.parse(JSON.stringify(gameArray));
      // first time need to open squares
      openSurroundSquares(newGameArray, squareIdx, state.columns, state.rows);

      return {
        ...state,
        gameStatus: GameStatus.START,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.SET_FLAG: {
      const { squareIdx } = payload;
      const clickedSquare = state.gameArray[squareIdx];

      if (
        isRevealed(clickedSquare.state) ||
        state.gameStatus !== GameStatus.START
      )
        return { ...state };

      const newGameArray: Square[] = JSON.parse(
        JSON.stringify(state.gameArray)
      );

      newGameArray[squareIdx].flagged = true;

      return {
        ...state,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.REMOVE_FLAG: {
      const { squareIdx } = payload;
      const clickedSquare = state.gameArray[squareIdx];

      if (
        isRevealed(clickedSquare.state) ||
        state.gameStatus !== GameStatus.START
      )
        return { ...state };

      const newGameArray: Square[] = JSON.parse(
        JSON.stringify(state.gameArray)
      );

      newGameArray[squareIdx].flagged = false;

      return {
        ...state,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.OPEN_SQUARE: {
      const { squareIdx } = payload;
      const clickedSquare = state.gameArray[squareIdx];

      // game over
      if (clickedSquare.state === SquareState.UNREVEALED_MINE) {
        return {
          ...state,
          gameStatus: GameStatus.LOSE,
        };
      }

      const newGameArray: Square[] = JSON.parse(
        JSON.stringify(state.gameArray)
      );
      openSurroundSquares(newGameArray, squareIdx, state.columns, state.rows);

      return {
        ...state,
        gameStatus: isGameSet(newGameArray, state.mines)
          ? GameStatus.WIN
          : GameStatus.START,
        gameArray: newGameArray,
      };
    }
    default:
      return state;
  }
};
