import { MouseBehavior } from "./../interface";
import {
  GameStatus,
  IMinesweeperState,
  MinesweeperAction,
  MinesweeperActionType,
  Square,
  SquareState,
} from "../interface";
import {
  changeAllMinesToFlags,
  deepClone,
  generateGameArray,
  generateSquareArray,
  getAllMineSquareWithFlag,
  getFlagsAmountByIndexs,
  getSurroundingIndexs,
  isAbleToOpenSquare,
  isAbleToOpenSquares,
  isGameSet,
  isRevealed,
  openSurroundSquare,
  openSurroundSquares,
  unVisitingAllSquare,
  visitingMultiSquare,
  visitingSquare,
} from "../utils";

export const minesweeperReducer = (
  state: IMinesweeperState,
  action: MinesweeperAction
): IMinesweeperState => {
  const { gameArray, openIndex, columns, rows, mines } = state;
  const { type } = action;

  switch (type) {
    case MinesweeperActionType.NEW:
      return {
        ...state,
        gameStatus: GameStatus.NEW,
        gameArray: generateSquareArray(rows * columns, "blank"),
      };

    case MinesweeperActionType.START: {
      if (openIndex === -1) return { ...state };

      const gameArray = generateGameArray(openIndex, mines, columns, rows);

      // first time need to open squares
      openSurroundSquare(gameArray, openIndex, state.columns, state.rows);

      return {
        ...state,
        gameStatus: GameStatus.START,
        gameArray,
      };
    }
    case MinesweeperActionType.SET_FLAG: {
      const { squareIdx, install } = action.payload;
      const clickedSquare = state.gameArray[squareIdx];

      if (isRevealed(clickedSquare) || state.gameStatus !== GameStatus.START)
        return { ...state };

      const newGameArray: Square[] = deepClone(state.gameArray);
      newGameArray[squareIdx].flagged = install;

      return {
        ...state,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.SET_MOUSE_BEHAVIOR: {
      const { squareIdx, behavior } = action.payload;

      const newGameArray: Square[] = deepClone(state.gameArray);
      const clickedSquare = newGameArray[squareIdx];

      switch (behavior) {
        case MouseBehavior.SINGLE:
          visitingSquare(clickedSquare);
          break;
        case MouseBehavior.MULTI:
          const visitingIndexs = [
            squareIdx,
            ...getSurroundingIndexs(squareIdx, columns, rows),
          ];
          visitingMultiSquare(
            newGameArray.filter((_, idx) => visitingIndexs.includes(idx))
          );
          break;
        default:
          unVisitingAllSquare(newGameArray);
      }

      return {
        ...state,
        openIndex: behavior === MouseBehavior.NONE ? -1 : squareIdx,
        mouseBehavior: behavior,
        gameArray: newGameArray,
      };
    }
    case MinesweeperActionType.OPEN_SQUARE: {
      if (!isAbleToOpenSquare(gameArray, openIndex)) return { ...state };

      // discover the mine => game over
      if (gameArray[openIndex].state === SquareState.UNREVEALED_MINE) {
        return {
          ...state,
          gameStatus: GameStatus.LOSE,
        };
      }

      const newGameArray: Square[] = deepClone(gameArray);
      openSurroundSquare(newGameArray, openIndex, columns, rows);

      // judge game status
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
      if (!isAbleToOpenSquares(gameArray, openIndex)) return { ...state };

      const openIndexs = getSurroundingIndexs(openIndex, columns, rows);
      const totalFlags = getFlagsAmountByIndexs(gameArray, openIndexs);

      const clickedSquare = gameArray[openIndex];

      // if totalFlags is not equeals to surroundingMines => do nothing
      if (totalFlags !== clickedSquare.surroundindMines)
        return {
          ...state,
        };

      const surroundingSquares = openIndexs.map(
        (openIndex) => gameArray[openIndex]
      );

      // if surroundingMines amount is not equeals to totalFlags => lose
      if (getAllMineSquareWithFlag(surroundingSquares).length !== totalFlags) {
        return {
          ...state,
          gameStatus: GameStatus.LOSE,
        };
      }

      // open squares
      const newGameArray: Square[] = JSON.parse(JSON.stringify(gameArray));
      openSurroundSquares(newGameArray, openIndexs, columns, rows);

      // judge game status
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
