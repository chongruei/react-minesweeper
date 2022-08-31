import {
  getFlagsAmountByIndexs,
  getSurroundingIndexs,
  getAllBothFlagAndMines,
  isAvailiableBeVisiting,
  isCanMultipleOpen,
  changeAllMinesToFlags,
} from "./../utils";
import { MouseBehavior } from "./../interface";
import {
  GameStatus,
  IMinesweeperState,
  MinesweeperAction,
  MinesweeperActionType,
  Square,
  SquareState,
  VisitState,
} from "../interface";
import {
  isGameSet,
  isRevealed,
  openSurroundSquare,
  openSurroundSquares,
} from "../utils";

export const minesweeperReducer = (
  state: IMinesweeperState,
  action: MinesweeperAction
): IMinesweeperState => {
  const { rows, columns, mines } = state;
  const { type } = action;
  switch (type) {
    case MinesweeperActionType.NEW:
      return {
        ...state,
        gameStatus: GameStatus.NEW,
        gameArray: Array(rows * columns).fill({
          surroundindMines: 0,
          visited: VisitState.NONE,
          flagged: false,
          state: SquareState.UNREVEALED_SQUARE,
        }),
      };

    case MinesweeperActionType.START: {
      const openIndex = state.openIndex;
      if (openIndex === -1) return { ...state };

      // mine array
      const minesArray: Square[] = Array(mines).fill({
        surroundindMines: 0,
        visited: VisitState.NONE,
        flagged: false,
        state: SquareState.UNREVEALED_MINE,
      });

      // blank array = rows * columns - mines amount - square (first square shouldn't be mine)
      const blankArray: Square[] = Array(rows * columns - mines - 1).fill({
        surroundindMines: 0,
        visited: VisitState.NONE,
        flagged: false,
        state: SquareState.UNREVEALED_SQUARE,
      });

      // random mine positions
      const gameArray = [...minesArray, ...blankArray].sort(
        () => Math.random() - 0.5
      );

      // insert first square to game array by index
      gameArray.splice(openIndex, 0, {
        surroundindMines: 0,
        visited: VisitState.NONE,
        flagged: false,
        state: SquareState.REVEALED_SQUARE,
      });

      const newGameArray: Square[] = JSON.parse(JSON.stringify(gameArray));
      // first time need to open squares
      openSurroundSquare(newGameArray, openIndex, state.columns, state.rows);

      return {
        ...state,
        gameStatus: GameStatus.START,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.SET_FLAG: {
      const { squareIdx, install } = action.payload;
      const clickedSquare = state.gameArray[squareIdx];

      if (
        isRevealed(clickedSquare.state) ||
        state.gameStatus !== GameStatus.START
      )
        return { ...state };

      const newGameArray: Square[] = JSON.parse(
        JSON.stringify(state.gameArray)
      );

      newGameArray[squareIdx].flagged = install;

      return {
        ...state,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.SET_MOUSE_BEHAVIOR: {
      const { rows, columns } = state;
      const { squareIdx, behavior } = action.payload;

      const newGameArray: Square[] = JSON.parse(
        JSON.stringify(state.gameArray)
      );

      const clickedSquare = newGameArray[squareIdx];

      switch (behavior) {
        case MouseBehavior.SINGLE:
          if (isAvailiableBeVisiting(clickedSquare)) {
            clickedSquare.visited = VisitState.VISITING;
          }
          break;
        case MouseBehavior.MULTI:
          const visitingIndexs = [
            squareIdx,
            ...getSurroundingIndexs(squareIdx, columns, rows),
          ];
          visitingIndexs.forEach((idx) => {
            const square = newGameArray[idx];
            if (isAvailiableBeVisiting(square))
              square.visited = VisitState.VISITING;
          });
          break;
        default:
          newGameArray.map((square) => {
            if (square.visited === VisitState.VISITING)
              square.visited = VisitState.NONE;

            return { ...square };
          });
      }

      return {
        ...state,
        openIndex: behavior === MouseBehavior.NONE ? -1 : squareIdx,
        mouseBehavior: behavior,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.OPEN_SQUARE: {
      const { gameArray, openIndex, columns, rows, mines } = state;
      if (openIndex === -1) return { ...state };

      const clickedSquare = gameArray[state.openIndex];
      if (clickedSquare.flagged) return { ...state };

      // game over
      if (clickedSquare.state === SquareState.UNREVEALED_MINE) {
        return {
          ...state,
          gameStatus: GameStatus.LOSE,
        };
      }

      const newGameArray: Square[] = JSON.parse(JSON.stringify(gameArray));
      openSurroundSquare(newGameArray, openIndex, columns, rows);
      const gameSet = isGameSet(newGameArray, mines);
      if (gameSet) {
        changeAllMinesToFlags(newGameArray);
      }

      return {
        ...state,
        gameStatus: gameSet ? GameStatus.WIN : GameStatus.START,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.OPEN_SQUARES: {
      const { gameArray, openIndex, columns, rows } = state;
      if (openIndex === -1) return { ...state };

      const clickedSquare = gameArray[state.openIndex];
      if (!isCanMultipleOpen(clickedSquare)) return { ...state };

      const openIndexs = getSurroundingIndexs(openIndex, columns, rows);
      const totalFlags = getFlagsAmountByIndexs(gameArray, openIndexs);

      if (totalFlags !== clickedSquare.surroundindMines)
        return {
          ...state,
        };

      const mineArray = openIndexs.map((openIndex) => gameArray[openIndex]);
      if (getAllBothFlagAndMines(mineArray).length !== totalFlags) {
        return {
          ...state,
          gameStatus: GameStatus.LOSE,
        };
      }

      const newGameArray: Square[] = JSON.parse(JSON.stringify(gameArray));
      openSurroundSquares(newGameArray, openIndexs, columns, rows);

      const gameSet = isGameSet(newGameArray, mines);
      if (gameSet) {
        changeAllMinesToFlags(newGameArray);
      }

      return {
        ...state,
        gameStatus: gameSet ? GameStatus.WIN : GameStatus.START,
        gameArray: newGameArray,
      };
    }
    default:
      return state;
  }
};
