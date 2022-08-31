import { FC } from "react";
import { useGameArray, useGameConig } from "./hooks/useMinesweeperContext";
import { Square } from "./square/square";

export const Board: FC = () => {
  const gameArray = useGameArray();
  const { columns } = useGameConig();

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {gameArray.map((square, idx) => {
        return <Square key={idx} square={square} squareIndex={idx} />;
      })}
    </div>
  );
};
