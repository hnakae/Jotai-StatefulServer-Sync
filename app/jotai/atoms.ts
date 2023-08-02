// state.ts (Jotai state)

import { atom } from "jotai";

// Define the Tic-Tac-Toe game state and other necessary variables
// state.ts

export const gameBoardAtom = atom<{ id: number; value: string | null }[][]>([
  [
    { id: 1, value: null },
    { id: 2, value: null },
    { id: 3, value: null },
  ],
  [
    { id: 4, value: null },
    { id: 5, value: null },
    { id: 6, value: null },
  ],
  [
    { id: 7, value: null },
    { id: 8, value: null },
    { id: 9, value: null },
  ],
]);

export const moveHistoryAtom = atom<{ row: number; col: number }[]>([]);

export const moveIndexAtom = atom<number>(0);

export const currentPlayerAtom = atom<string>("");

export const messageAtom = atom<string>("loading...");

export const winnerAtom = atom<number[] | null>(null); // Updated type to store the winning square IDs
export const winConAtom = atom<number[] | null>(null);

export const redoHistoryAtom = atom<{ row: number; col: number }[]>([]);
