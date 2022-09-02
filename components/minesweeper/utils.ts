import { GameStatus, Square, SquareState, VisitState } from "./interface";

export const generateSquareArray = (
  amount: number,
  type: "mine" | "blank"
): Square[] => {
  return Array(amount).fill({
    surroundindMines: 0,
    visited: VisitState.NONE,
    flagged: false,
    state:
      type === "mine"
        ? SquareState.UNREVEALED_MINE
        : SquareState.UNREVEALED_SQUARE,
  });
};

export const generateGameArray = (
  openIndex: number,
  mines: number,
  columns: number,
  rows: number,
  byFlag: boolean
): Square[] => {
  // mine array
  const minesArray: Square[] = generateSquareArray(mines, "mine");

  // blank array = rows * columns - mines amount - square (first square shouldn't be mine)
  const blankAmount = rows * columns - mines - 1;
  const blankArray: Square[] = generateSquareArray(
    byFlag ? blankAmount + 1 : blankAmount,
    "blank"
  );

  // random mine positions
  const gameArray = [...minesArray, ...blankArray].sort(
    () => Math.random() - 0.5
  );

  if (!byFlag) {
    // insert first square to game array by index
    gameArray.splice(openIndex, 0, {
      surroundindMines: 0,
      visited: VisitState.NONE,
      flagged: false,
      state: SquareState.REVEALED_SQUARE,
    });
  }

  return deepClone(gameArray);
};

export const isMine = (square: Square) =>
  square.state === SquareState.REVEALED_MINE ||
  square.state === SquareState.UNREVEALED_MINE;

export const isRevealed = (square: Square) =>
  square.state === SquareState.REVEALED_MINE ||
  square.state === SquareState.REVEALED_SQUARE;

export const isBothFlagAndMine = (square: Square): boolean => {
  return square.flagged && isMine(square);
};

export const isAvailiableBeVisiting = (square: Square): boolean => {
  const { visited, flagged } = square;
  return visited === VisitState.NONE && !(flagged || isRevealed(square));
};

export const isAbleToOpenSquare = (
  squareArray: Square[],
  openIndex: number
): boolean => {
  if (openIndex === -1) return false;
  const clickedSquare = squareArray[openIndex];
  if (clickedSquare.flagged) return false;

  return true;
};

export const isAbleToSetFlag = (
  square: Square,
  gameStatus: GameStatus
): boolean => {
  if (
    isRevealed(square) ||
    gameStatus === GameStatus.WIN ||
    gameStatus === GameStatus.LOSE
  )
    return false;
  return true;
};

export const isAbleToOpenSquares = (
  squareArray: Square[],
  openIndex: number
): boolean => {
  if (openIndex === -1) return false;
  const clickedSquare = squareArray[openIndex];
  const { surroundindMines, state, flagged } = clickedSquare;
  if (
    state === SquareState.REVEALED_SQUARE &&
    surroundindMines > 0 &&
    !flagged
  ) {
    return true;
  }
  return false;
};

export const isGameSet = (gameArray: Square[], mines: number): boolean => {
  const needOpenSquareAmount = gameArray.length - mines;

  return (
    gameArray.filter((square) => square.state === SquareState.REVEALED_SQUARE)
      .length === needOpenSquareAmount
  );
};

export const getFlagsAmountByIndexs = (
  gameArray: Square[],
  openIndexs: number[]
): number => {
  return openIndexs.reduce((total, openIndex) => {
    return gameArray[openIndex].flagged ? total + 1 : total;
  }, 0);
};

export const getAllMineSquareWithFlag = (mineArray: Square[]): Square[] => {
  return mineArray.filter((square) => isBothFlagAndMine(square));
};

export const getSurroundingIndexs = (
  squareIdx: number,
  columns: number,
  rows: number
): number[] => {
  // current square positions
  const row = ~~(squareIdx / columns);
  const column = squareIdx % columns;

  // [0,1,2]
  // [3, ,4]
  // [5,6,7]
  return [
    // top left
    squareIdx - columns - 1,
    // top
    squareIdx - columns,
    // top right
    squareIdx - columns + 1,
    // middle left
    squareIdx - 1,
    // middle right
    squareIdx + 1,
    // bottom left
    squareIdx + columns - 1,
    // bottom
    squareIdx + columns,
    // bottom right
    squareIdx + columns + 1,
  ].filter((_, idx) => {
    // over top boundary
    if (row === 0 && idx < 3) return false;
    // over bottom boundary
    if (row === rows - 1 && idx > 4) return false;
    // over left boundary
    if (column === 0 && [0, 3, 5].includes(idx)) return false;
    // over right boundary
    if (column === columns - 1 && [2, 4, 7].includes(idx)) return false;
    return true;
  });
};

export const getAllMines = (gameArray: Square[]) => {
  return gameArray.filter((square) => isMine(square));
};

export const changeAllMinesToFlags = (gameArray: Square[]) => {
  const allMines = getAllMines(gameArray);
  allMines.forEach((square) => (square.flagged = true));
};

export const openSurroundSquares = (
  gameArray: Square[],
  squareIndexs: number[],
  columns: number,
  rows: number
) => {
  squareIndexs.forEach((idx) => {
    openSurroundSquare(gameArray, idx, columns, rows);
  });
};

export const openSurroundSquare = (
  gameArray: Square[],
  squareIdx: number,
  columns: number,
  rows: number
) => {
  const square = gameArray[squareIdx];
  if (!square || square.visited === VisitState.VISITED || square.flagged)
    return;

  square.state = SquareState.REVEALED_SQUARE;
  square.visited = VisitState.VISITED;

  const surroundingIndexs = getSurroundingIndexs(squareIdx, columns, rows);

  const findedMines = gameArray.filter(
    (square, idx) => surroundingIndexs.includes(idx) && isMine(square)
  ).length;

  square.surroundindMines = findedMines;

  // no any mines => continue openSurroundSquares
  if (findedMines === 0) {
    openSurroundSquares(gameArray, surroundingIndexs, columns, rows);
  }
};

export const visitingSquare = (square: Square): void => {
  if (isAvailiableBeVisiting(square)) {
    square.visited = VisitState.VISITING;
  }
};

export const visitingMultiSquare = (squares: Square[]): void => {
  squares
    .filter((square) => isAvailiableBeVisiting(square))
    .every((square: Square) => (square.visited = VisitState.VISITING));
};

export const unVisitingAllSquare = (squares: Square[]) => {
  squares
    .filter((square) => square.visited === VisitState.VISITING)
    .every((square) => (square.visited = VisitState.NONE));
};

export const getNumberColor = (num: number): string => {
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
      return "#64748b";
    case 6:
      return "#475569";
    case 7:
      return "#831843";
    // lucky?
    case 8:
      return "#f0fdfa";
    default:
      return "";
  }
};

export const deepClone = <T>(payload: T) => {
  return JSON.parse(JSON.stringify(payload));
};
