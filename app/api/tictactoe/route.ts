// pages/api/ticTacToe.ts

import { NextRequest, NextResponse } from "next/server";

// Define the Tic-Tac-Toe game state and other necessary variables
// ticTacToeState.ts

// Define the Tic-Tac-Toe game state and other necessary variables
export let gameBoard: { id: number; value: string | null }[][] = [
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
];
export let currentPlayer: "X" | "O" | null = "X";
export let moveHistory: { row: number; col: number }[] = [];
export let moveIndex: number = 0;
export let message: string = "";
export let winner: string | null = "";
export let winCon: number[] | null = null;

// const winningCombos: number[][] = [
//   [1, 2, 3], // top row
//   [4, 5, 6], // middle row
//   [7, 8, 9], // bottom row
//   [1, 4, 7], // left column
//   [2, 5, 8], // middle column
//   [3, 6, 9], // right column
//   [1, 5, 9], // descending diagonal
//   [3, 5, 7], // ascending diagonal
// ];
// Function to check for a winner and set the winCon variable
function checkWinner(): string | null {
  // Check rows for a winner
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[i][0].value &&
      gameBoard[i][0].value === gameBoard[i][1].value &&
      gameBoard[i][0].value === gameBoard[i][2].value
    ) {
      // If a winner is found, set the winCon variable with the IDs of the winning row
      winCon = [gameBoard[i][0].id, gameBoard[i][1].id, gameBoard[i][2].id];

      // Return the value of the winning square (either "X" or "O")
      return gameBoard[i][0].value;
    }
  }

  // Check columns for a winner
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[0][i].value &&
      gameBoard[0][i].value === gameBoard[1][i].value &&
      gameBoard[0][i].value === gameBoard[2][i].value
    ) {
      // If a winner is found, set the winCon variable with the IDs of the winning column
      winCon = [gameBoard[0][i].id, gameBoard[1][i].id, gameBoard[2][i].id];

      // Return the value of the winning square (either "X" or "O")
      return gameBoard[0][i].value;
    }
  }

  // Check diagonals for a winner
  if (
    gameBoard[0][0].value &&
    gameBoard[0][0].value === gameBoard[1][1].value &&
    gameBoard[0][0].value === gameBoard[2][2].value
  ) {
    // If a winner is found, set the winCon variable with the IDs of the winning diagonal
    winCon = [gameBoard[0][0].id, gameBoard[1][1].id, gameBoard[2][2].id];

    // Return the value of the winning square (either "X" or "O")
    return gameBoard[0][0].value;
  }
  if (
    gameBoard[0][2].value &&
    gameBoard[0][2].value === gameBoard[1][1].value &&
    gameBoard[0][2].value === gameBoard[2][0].value
  ) {
    // If a winner is found, set the winCon variable with the IDs of the winning diagonal
    winCon = [gameBoard[0][2].id, gameBoard[1][1].id, gameBoard[2][0].id];

    // Return the value of the winning square (either "X" or "O")
    return gameBoard[0][2].value;
  }

  return null; // No winner
}

// Function to check if the game is a draw
function checkDraw(): boolean {
  // Check if there are any empty squares left
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameBoard[i][j].value === null) {
        return false; // Not a draw, there are still empty squares
      }
    }
  }
  return true; // It's a draw, all squares are filled
}

// Function to reset the game and return the gameBoard and currentPlayer
function resetGame(): {
  gameBoard: { id: number; value: string | null }[][];
  currentPlayer: string;
} {
  gameBoard = [
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
  ];
  currentPlayer = "X";
  return { gameBoard, currentPlayer };
}

// // Interface for the expected request body
// interface MoveRequestBody {
//   row: number;
//   col: number;
// }

// Next.js API route handler

// Function to update move history and index
// function updateMoveHistory(row: number, col: number) {
//   moveHistory = [...moveHistory.slice(0, moveIndex + 1), { row, col }];
//   moveIndex++;
// }

export async function GET(request: NextRequest) {
  return NextResponse.json({
    gameBoard,
    currentPlayer,
    message: "fetched initial state",
    moveHistory,
    moveIndex,
    winner,
    winCon,
  });
}
export async function POST(request: NextRequest) {
  const { row, col } = await request.json();

  // Perform the move and check for the game result
  if (gameBoard[row][col].value === null) {
    gameBoard[row][col].value = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    message += `[${row + 1}, ${col + 1}], `;
    moveHistory = [...moveHistory.slice(0, moveIndex + 1), { row, col }];
    moveIndex++;
    winner = checkWinner();
    // winCon = checkWinCon();
    if (winner) {
      return NextResponse.json({
        // message: `Player ${winner} wins!`,
        message,
        gameBoard,
        winner,
        winCon,
        moveHistory,
        moveIndex,
      });
    } else if (checkDraw()) {
      return NextResponse.json({
        message: "It's a draw!",
        gameBoard,
        moveHistory,
        moveIndex,
      });
    } else {
      console.log(`player: ${currentPlayer}`);
      return NextResponse.json({
        message,
        gameBoard,
        currentPlayer,
        moveHistory,
        moveIndex,
      });
    }
  } else {
    return NextResponse.json(
      { message: "Invalid move", gameBoard, moveHistory, moveIndex },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { gameBoard, currentPlayer } = resetGame();
  moveHistory = [];
  moveIndex = 0;
  winner = "";
  winCon = null;
  message = "";
  return NextResponse.json({
    message,
    gameBoard,
    currentPlayer,
    moveIndex,
    moveHistory,
    winner,
    winCon,
  });
}

export async function PUT(request: NextRequest) {
  if (moveIndex > 0) {
    const currMove = moveHistory[moveIndex]; // Get the current move to undo

    // Check if currMove is not undefined before proceeding

    gameBoard[currMove.row][currMove.col].value = null; // Undo the current move
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    moveIndex--;
    // moveHistory.pop();
    moveHistory = moveHistory.slice(0, moveIndex); // Update the moveHistory array
    winner = null;
    winCon = null;
    return NextResponse.json({
      message: "undo",
      gameBoard,
      currentPlayer,
      moveHistory,
      moveIndex,
      winner,
      winCon,
    });
  } else {
    return NextResponse.json(
      { message: "Cannot undo further", gameBoard, moveHistory, moveIndex },
      { status: 400 }
    );
  }
}

// export async function changePlayer(request: NextRequest) {
//   currentPlayer = currentPlayer === "X" ? "O" : "X";
//   return NextResponse.json({
//     message: "Player changed",
//     currentPlayer,
//   });
// }

// export async function PATCH(request: NextRequest) {
//   // Implement the redo functionality
//   if (moveIndex < moveHistory.length - 1) {
//     moveIndex++;
//     const nextMove = moveHistory[moveIndex];
//     gameBoard[nextMove.row][nextMove.col] = currentPlayer;
//     currentPlayer = currentPlayer === "X" ? "O" : "X";
//   }
//   return NextResponse.json({ gameBoard, currentPlayer, moveIndex });
// }
