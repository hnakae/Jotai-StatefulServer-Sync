"use client";
import Board from "./Board";

const Game = () => {
  return (
    <div className="game flex items-center justify-center h-screen">
      <div className="game-board flex">
        <Board />
      </div>
      <div className="game-info">{/* Game info and status */}</div>
    </div>
  );
};

export default Game;
