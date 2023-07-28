// "use client";
interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinning: boolean;
}

const Square = ({ value, onClick, isWinning }: SquareProps) => {
  return (
    <button
      className={`square w-16 h-16 flex items-center justify-center outline  text-xl font-bold ${
        isWinning ? "bg-green-300" : "white"
      }`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
