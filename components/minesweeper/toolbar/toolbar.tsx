import { FC } from "react";
import { useGameStatus } from "../hooks/useMinesweeperContext";
import { useMinesweeperSlice } from "../hooks/useMinesweeperSlice";
import { GameStatus } from "../interface";

export const Toolbar: FC = () => {
  const gameStatus = useGameStatus();
  const { newGame } = useMinesweeperSlice();

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
    <div className="flex items-center justify-center w-full bg-[#4a752d] h-12">
      <img
        alt="minesweeper"
        className="hover:cursor-pointer"
        src={getEmoji()}
        height={30}
        width={30}
        onClick={() => newGame()}
      />
    </div>
  );
};
