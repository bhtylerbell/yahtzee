'use client';

import { Die as DieType } from '@/lib/types';

interface DiceProps {
  dice: DieType[];
  onToggleHold: (index: number) => void;
  disabled?: boolean;
  isRolling?: boolean;
}

const DiceDot = ({ position }: { position: string }) => (
  <div
    className={`absolute w-2 h-2 bg-white rounded-full ${position}`}
  />
);

const DiceFace = ({ value, held, onClick, disabled, isRolling }: { 
  value: number; 
  held: boolean; 
  onClick: () => void;
  disabled?: boolean;
  isRolling?: boolean;
}) => {
  const dots: Record<number, React.JSX.Element[]> = {
    1: [<DiceDot key="center" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />],
    2: [
      <DiceDot key="tl" position="top-2 left-2" />,
      <DiceDot key="br" position="bottom-2 right-2" />,
    ],
    3: [
      <DiceDot key="tl" position="top-2 left-2" />,
      <DiceDot key="center" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />,
      <DiceDot key="br" position="bottom-2 right-2" />,
    ],
    4: [
      <DiceDot key="tl" position="top-2 left-2" />,
      <DiceDot key="tr" position="top-2 right-2" />,
      <DiceDot key="bl" position="bottom-2 left-2" />,
      <DiceDot key="br" position="bottom-2 right-2" />,
    ],
    5: [
      <DiceDot key="tl" position="top-2 left-2" />,
      <DiceDot key="tr" position="top-2 right-2" />,
      <DiceDot key="center" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />,
      <DiceDot key="bl" position="bottom-2 left-2" />,
      <DiceDot key="br" position="bottom-2 right-2" />,
    ],
    6: [
      <DiceDot key="tl" position="top-2 left-2" />,
      <DiceDot key="tr" position="top-2 right-2" />,
      <DiceDot key="ml" position="top-1/2 left-2 -translate-y-1/2" />,
      <DiceDot key="mr" position="top-1/2 right-2 -translate-y-1/2" />,
      <DiceDot key="bl" position="bottom-2 left-2" />,
      <DiceDot key="br" position="bottom-2 right-2" />,
    ],
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-14 h-14 rounded-lg transition-all duration-200
        ${held 
          ? 'bg-blue-600 ring-3 ring-blue-400 shadow-lg transform scale-95' 
          : 'bg-red-600 hover:bg-red-500 hover:shadow-lg active:scale-95'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isRolling && !held ? 'animate-[roll_0.3s_ease-in-out]' : ''}
        shadow-md
      `}
      aria-label={`Die showing ${value}, ${held ? 'held' : 'not held'}`}
    >
      {dots[value]}
    </button>
  );
};

export default function Dice({ dice, onToggleHold, disabled = false, isRolling = false }: DiceProps) {
  return (
    <div className="flex justify-center gap-2">
      {dice.map((die, index) => (
        <DiceFace
          key={index}
          value={die.value}
          held={die.held}
          onClick={() => onToggleHold(index)}
          disabled={disabled}
          isRolling={isRolling}
        />
      ))}
    </div>
  );
}
