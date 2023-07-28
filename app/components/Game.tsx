// "use client";
import Board from "./Board";
import Sibling from "./Sibling";

const Game = () => {
  return (
    <div className="game flex flex-col items-center justify-center h-screen">
      <div className="game-board flex">
        <Board />
      </div>
      <div className="outline mt-4">
        <Sibling />
      </div>
    </div>
  );
};

export default Game;
