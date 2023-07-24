"use client";
interface SquareProps {
  value: string | null;
  onClick: () => void;
}

const Square = ({ value, onClick }: SquareProps) => {
  return (
    <button
      className="square w-10 h-10 flex items-center justify-center outline text-xl font-bold "
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
