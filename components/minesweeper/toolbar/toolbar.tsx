/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import { useGameStatus } from "../hooks/useMinesweeperContext";
import { useMinesweeperSlice } from "../hooks/useMinesweeperSlice";
import { GameStatus } from "../interface";
import { MinesCount } from "./minesCount";
import { Timer } from "./timer";

export const Toolbar: FC = () => {
  const gameStatus = useGameStatus();
  const { newGame } = useMinesweeperSlice();
  const [gameCount, setGameCount] = useState<number>(0);

  const handleClickStart = () => {
    setGameCount((prevGameCount) => prevGameCount + 1);
    newGame();
  };

  const getEmoji = () => {
    switch (gameStatus) {
      case GameStatus.WIN:
        return "/win.png";
      case GameStatus.LOSE:
        return "/cry.png";
      default:
        return "/smile.png";
    }
  };

  return (
    <div className="flex items-center justify-between w-full bg-[#4a752d] h-12 px-3">
      <MinesCount />
      <img
        alt="minesweeper"
        className="hover:cursor-pointer"
        src={getEmoji()}
        height={30}
        width={30}
        onClick={handleClickStart}
      />
      <Timer gameCount={gameCount} />
    </div>
  );
};
