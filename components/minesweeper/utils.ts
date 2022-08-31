import { Square, SquareState, VisitState } from "./interface";

export const isMine = (st: SquareState) =>
  st === SquareState.REVEALED_MINE || st === SquareState.UNREVEALED_MINE;

export const isRevealed = (st: SquareState) =>
  st === SquareState.REVEALED_MINE || st === SquareState.REVEALED_SQUARE;

export const isCanMultipleOpen = (square: Square) => {
  const { surroundindMines, state, flagged } = square;
  if (
    state === SquareState.REVEALED_SQUARE &&
    surroundindMines > 0 &&
    !flagged
  ) {
    return true;
  }
  return false;
};

export const isAvailiableBeVisiting = (square: Square): boolean => {
  const { visited, flagged, state } = square;
  return visited === VisitState.NONE && !(flagged || isRevealed(state));
};

export const getFlagsAmountByIndexs = (
  gameArray: Square[],
  openIndexs: number[]
) => {
  return openIndexs.reduce((total, openIndex) => {
    return gameArray[openIndex].flagged ? total + 1 : total;
  }, 0);
};

export const getAllBothFlagAndMines = (mineArray: Square[]): Square[] => {
  return mineArray.filter((square) => isBothFlagAndMine(square));
};

export const isBothFlagAndMine = (square: Square): boolean => {
  return square.flagged && isMine(square.state);
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
  let findedMines = 0;

  for (let i = 0; i < surroundingIndexs.length; i++) {
    const surroundingIdx = surroundingIndexs[i];
    const square = gameArray[surroundingIdx];

    // discover the unrevealed mines!
    if (isMine(square.state)) {
      findedMines++;
    }
  }

  // no any mines => continue openSurroundSquares
  if (findedMines === 0) {
    for (let i = 0; i < surroundingIndexs.length; i++) {
      const surroundingIdx = surroundingIndexs[i];
      openSurroundSquare(gameArray, surroundingIdx, columns, rows);
    }
  } else {
    square.surroundindMines = findedMines;
  }
};

export const isGameSet = (gameArray: Square[], mines: number): boolean => {
  const needOpenSquareAmount = gameArray.length - mines;

  return (
    gameArray.filter((square) => square.state === SquareState.REVEALED_SQUARE)
      .length === needOpenSquareAmount
  );
};

export const getNumberColor = (num: number) => {
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
