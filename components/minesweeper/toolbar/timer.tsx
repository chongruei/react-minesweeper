import { useInterval } from "@hooks/useInterval";
import { FC, useEffect, useState } from "react";
import { useGameStatus } from "../hooks/useMinesweeperContext";
import { GameStatus } from "../interface";

interface IProps {
  gameCount: number;
}

export const Timer: FC<IProps> = ({ gameCount }) => {
  const [time, setTime] = useState<number>(0);
  const gameStatus = useGameStatus();

  useEffect(() => {
    setTime(0);
  }, [gameCount]);

  useInterval(
    () => {
      setTime((prevTime) => prevTime + 1);
    },
    gameStatus === GameStatus.START ? 1000 : null
  );

  return (
    <span className="text-white text-3xl">
      {time.toString().padStart(3, "0")}
    </span>
  );
};
