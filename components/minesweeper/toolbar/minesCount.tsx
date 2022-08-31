import { FC } from "react";
import { useMinesCount } from "../hooks/useMinesweeperContext";

export const MinesCount: FC = () => {
  const count = useMinesCount();

  return (
    <span className="text-white text-3xl">
      {count > -1 ? count.toString().padStart(3, "0") : count}
    </span>
  );
};
