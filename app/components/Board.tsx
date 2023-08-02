"use client";
import { useEffect } from "react";
import { useAtom } from "jotai";
import Square from "./Square";
import {
  gameBoardAtom,
  moveHistoryAtom,
  moveIndexAtom,
  currentPlayerAtom,
  messageAtom,
  winnerAtom,
  winConAtom,
  redoHistoryAtom,
} from "../jotai/atoms"; // Import the atoms from the atoms.ts file

const Board = () => {
  const [board, setBoard] = useAtom(gameBoardAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const [winner, setWinner] = useAtom(winnerAtom);
  const [winCon, setWinCon] = useAtom(winConAtom);

  const [moveHistory, setMoveHistory] = useAtom(moveHistoryAtom);
  const [moveIndex, setMoveIndex] = useAtom(moveIndexAtom);

  const [redoHistory, setRedoHistory] = useAtom(redoHistoryAtom);
  // const current = moveHistory[moveIndex];

  useEffect(() => {
    // Fetch initial board state from the API when the component mounts
    fetch("/api/tictactoe")
      .then((response) => response.json())
      .then((data) => {
        setBoard(data.gameBoard);
        setCurrentPlayer(data.currentPlayer);
        setMessage(data.message);
        setMoveHistory(data.moveHistory);
        setMoveIndex(data.moveIndex);
        setWinner(data.winner);
        setWinCon(data.winCon);
      })
      .catch((error) => {
        console.error("Error fetching initial board state:", error);
      });
  }, [
    setBoard,
    setCurrentPlayer,
    setMessage,
    setMoveHistory,
    setMoveIndex,
    setWinner,
    setWinCon,
    setRedoHistory,
  ]);

  const handleSquareClick = (row: number, col: number) => {
    // Make a move when a square is clicked
    if (currentPlayer && board[row][col].value === null) {
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
          setMessage(data.message);
          setCurrentPlayer(data.currentPlayer);

          setMoveHistory(data.moveHistory);
          setMoveIndex(data.moveIndex);

          if (data.winner) {
            setWinner(data.winner);
            setWinCon(data.winCon);
          }
        })
        .catch((error) => {
          console.error("Error making move:", error);
          // Handle error state or display an error message to the user
        });
    }
  };

  const handleUndo = () => {
    if (moveIndex > 0) {
      fetch("/api/tictactoe", {
        method: "PUT",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Undo failed");
          }
          return response.json();
        })
        .then((data) => {
          setBoard(data.gameBoard);
          setMessage(data.message);
          setCurrentPlayer(data.currentPlayer);

          setMoveHistory(data.moveHistory);
          setMoveIndex(data.moveIndex);

          setRedoHistory(data.redoHistory);
        })
        .catch((error) => {
          console.error("Error undoing move:", error);
          // Handle error state or display an error message to the user
        });
    }
  };

  const handleRedo = () => {
    if (moveIndex < moveHistory.length) {
      fetch("/api/tictactoe", {
        method: "PATCH",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Redo failed");
          }
          // console.log("patch");
          return response.json();
        })
        .then((data) => {
          // console.log("redo");
          setBoard(data.gameBoard);
          setMessage(data.message);
          setCurrentPlayer(data.currentPlayer);

          setMoveHistory(data.moveHistory);
          setMoveIndex(data.moveIndex);
          setRedoHistory(data.redoHistory);
          if (data.winner) {
            setWinner(data.winner);
            setWinCon(data.winCon);
          } else {
            setWinner(null);
            setWinCon(null);
          }
        })
        .catch((error) => {
          console.error("Error redoing move:", error);
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
        setMessage(data.message); // Reset the message when the game is reset
        setMoveIndex(data.moveIndex);
        setMoveHistory(data.moveHistory);
        setWinner(data.winner);
        setWinCon(data.winCon);
        setRedoHistory(data.redoHistory);
      })
      .catch((error) => {
        console.error("Error resetting the game:", error);
        // Handle error state or display an error message to the user
      });
  };

  // Render the game board UI using the board state
  return (
    <>
      <div className="flex flex-col space-y-4 outline p-4 items-center">
        <div className="board-container  outline justify-center items-center w-[300px] h-[300px] space-y-4 flex flex-col ">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-4">
              {row.map(({ id, value }, colIndex) => (
                <Square
                  key={id}
                  value={value}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  isWinning={winCon?.includes(id) || false}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="p-4 w-[500px] space-y-4">
          <div className="justify-center flex flex-col outline p-4 h-[250px]">
            {message && <div className="message">{message}</div>}
            <br />

            <div>move history</div>
            <ol>
              {moveHistory.map((move, idx) => (
                <li key={idx}>
                  #{idx} : [{move.row}, {move.col}]
                </li>
              ))}
            </ol>
            <br />

            <div>redo history</div>
            <ol>
              {redoHistory.map((move, idx) => (
                <li key={idx}>
                  [{move.row}, {move.col}]
                </li>
              ))}
            </ol>
          </div>
          <div className="flex justify-center p-4 space-x-4 outline">
            <button className="outline p-3" onClick={resetGame}>
              Reset Game
            </button>
            <button className="outline p-3" onClick={handleUndo}>
              Undo
            </button>
            <button className="outline p-3" onClick={handleRedo}>
              Redo
            </button>
          </div>
        </div>
      </div>
      <div className="w-[200px] min-h-full outline ml-1 flex justify-center items-center">
        {currentPlayer && winner != null && (
          <div className="message">{currentPlayer}&apos;s turn</div>
        )}
        {winner && <div>winner: {winner}</div>}
      </div>
    </>
  );
};

export default Board;
