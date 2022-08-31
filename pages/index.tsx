import type { NextPage } from "next";
import { Minesweeper } from "@components/minesweeper/minesweeper";
import { DEFAULT_COLS, DEFAULT_MINES, DEFAULT_ROWS } from "config";

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-200">
      <Minesweeper
        columns={DEFAULT_COLS}
        rows={DEFAULT_ROWS}
        mines={DEFAULT_MINES}
      />
    </div>
  );
};

export default Home;
