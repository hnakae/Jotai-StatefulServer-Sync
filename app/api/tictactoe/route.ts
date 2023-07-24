// pages/api/ticTacToe.ts

import { NextRequest, NextResponse } from "next/server";

// Define the Tic-Tac-Toe game state and other necessary variables
let gameBoard: (string | null)[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

let currentPlayer: string = "X";

// Function to check for a winner
function checkWinner(): string | null {
  // Check rows for a winner
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[i][0] &&
      gameBoard[i][0] === gameBoard[i][1] &&
      gameBoard[i][0] === gameBoard[i][2]
    ) {
      return gameBoard[i][0];
    }
  }

  // Check columns for a winner
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[0][i] &&
      gameBoard[0][i] === gameBoard[1][i] &&
      gameBoard[0][i] === gameBoard[2][i]
    ) {
      return gameBoard[0][i];
    }
  }

  // Check diagonals for a winner
  if (
    gameBoard[0][0] &&
    gameBoard[0][0] === gameBoard[1][1] &&
    gameBoard[0][0] === gameBoard[2][2]
  ) {
    return gameBoard[0][0];
  }
  if (
    gameBoard[0][2] &&
    gameBoard[0][2] === gameBoard[1][1] &&
    gameBoard[0][2] === gameBoard[2][0]
  ) {
    return gameBoard[0][2];
  }

  return null; // No winner
}

// Function to check if the game is a draw
function checkDraw(): boolean {
  // Check if there are any empty squares left
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameBoard[i][j] === null) {
        return false; // Not a draw, there are still empty squares
      }
    }
  }
  return true; // It's a draw, all squares are filled
}

// Function to reset the game and return the gameBoard and currentPlayer
function resetGame(): {
  gameBoard: (string | null)[][];
  currentPlayer: string;
} {
  gameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  currentPlayer = "X";
  return { gameBoard, currentPlayer };
}

// Interface for the expected request body
interface MoveRequestBody {
  row: number;
  col: number;
}

// Next.js API route handler

export async function GET(request: NextRequest) {
  return NextResponse.json({ gameBoard, currentPlayer });
}

export async function POST(request: NextRequest) {
  const { row, col } = await request.json();

  // Perform the move and check for the game result
  if (gameBoard[row][col] === null) {
    gameBoard[row][col] = currentPlayer;
    const winner = checkWinner();
    if (winner) {
      return NextResponse.json({
        message: `Player ${winner} wins!`,
        gameBoard,
      });
    } else if (checkDraw()) {
      return NextResponse.json({ message: "It's a draw!", gameBoard });
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      return NextResponse.json({ message: "Move successful", gameBoard });
    }
  } else {
    return NextResponse.json(
      { message: "Invalid move", gameBoard },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { gameBoard, currentPlayer } = resetGame();
  return NextResponse.json({ message: "Game reset", gameBoard, currentPlayer });
}
