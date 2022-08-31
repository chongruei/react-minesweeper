import { Square, SquareState } from "./interface";

export const isMine = (st: SquareState) =>
  st === SquareState.REVEALED_MINE || st === SquareState.UNREVEALED_MINE;

export const isRevealed = (st: SquareState) =>
  st === SquareState.REVEALED_MINE || st === SquareState.REVEALED_SQUARE;

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
  squareIdx: number,
  columns: number,
  rows: number
) => {
  const square = gameArray[squareIdx];

  if (square.visited || square.flagged) return;

  square.state = SquareState.REVEALED_SQUARE;
  square.visited = true;

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
      openSurroundSquares(gameArray, surroundingIdx, columns, rows);
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
