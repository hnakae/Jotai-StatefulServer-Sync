"use client";
import React from "react";
import { atom, useAtom } from "jotai";
import {
  gameBoardAtom,
  moveHistoryAtom,
  moveIndexAtom,
  currentPlayerAtom,
  messageAtom,
  winnerAtom,
  winConAtom,
} from "../jotai/atoms";

const gameStatusAtom = atom((get) => {
  const winner = get(winnerAtom);
  const moveIndex = get(moveIndexAtom);
  if (winner) {
    return "win";
  } else if (moveIndex >= 9) {
    return "draw";
  } else {
    return "ongoing";
  }
});

// Usage in Sibling component
const Sibling = () => {
  const [message, setMessage] = useAtom(messageAtom);
  const [gameStatus] = useAtom(gameStatusAtom);

  return (
    <div className="p-4">
      Accessing State from sibling! <br />
      {message}
      <br />
      Game Status: {gameStatus}
    </div>
  );
};

export default Sibling;
