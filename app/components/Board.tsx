"use client";
import { useEffect, useState } from "react";
import Square from "./Square";

const Board = () => {
  const [board, setBoard] = useState<(string | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const [message, setMessage] = useState<string>("Tic Tac Toe");

  useEffect(() => {
    // Fetch initial board state from the API when the component mounts
    fetch("/api/tictactoe")
      .then((response) => response.json())
      .then((data) => {
        setBoard(data.gameBoard);
        setCurrentPlayer(data.currentPlayer);
      })
      .catch((error) => {
        console.error("Error fetching initial board state:", error);
      });
  }, []);

  const handleSquareClick = (row: number, col: number) => {
    // Make a move when a square is clicked
    if (currentPlayer && board[row][col] === null) {
      fetch("/api/tictactoe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ row, col }),
      })
        .then((response) => response.json())
        .then((data) => {
          setBoard(data.gameBoard);
          if (data.message) {
            // Display message (e.g., winner or draw)
            setMessage(data.message);
          } else {
            setCurrentPlayer(data.currentPlayer);
          }
        })
        .catch((error) => {
          console.error("Error making move:", error);
          // Handle error state or display an error message to the user
        });
    }
  };
  // Function to reset the game state on the server
  const resetGame = () => {
    fetch("/api/tictactoe", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setBoard(data.gameBoard);
        setCurrentPlayer(data.currentPlayer);
        setMessage("reset"); // Reset the message when the game is reset
      })
      .catch((error) => {
        console.error("Error resetting the game:", error);
        // Handle error state or display an error message to the user
      });
  };

  // Render the game board UI using the board state
  return (
    <div className="board-container  p-5 min-w-300 min-h-300 grid gap-4 ">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row grid grid-cols-3 gap-4">
          {row.map((squareValue, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              value={squareValue}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
      {message && <div className="message">{message}</div>}
      <button className="mt-4 outline p-3" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default Board;
