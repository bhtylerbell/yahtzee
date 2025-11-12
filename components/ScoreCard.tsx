'use client';

import { useState } from 'react';
import { ScoreCard as ScoreCardType, ScoreCategory, Die } from '@/lib/types';
import { 
  calculateScore, 
  getCategoryName,
  getCategoryDescription,
  calculateUpperSectionTotal,
  calculateUpperSectionBonus,
  calculateLowerSectionTotal,
  calculateTotalScore,
} from '@/lib/gameLogic';

interface ScoreCardProps {
  scores: ScoreCardType;
  dice: Die[];
  onSelectCategory: (category: ScoreCategory) => void;
  rollsLeft: number;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative w-full block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg whitespace-nowrap shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      )}
    </div>
  );
};

const ScoreRow = ({ 
  category, 
  score, 
  potentialScore, 
  onSelect, 
  canSelect,
  justScored 
}: {
  category: ScoreCategory;
  score: number | null;
  potentialScore: number;
  onSelect: () => void;
  canSelect: boolean;
  justScored: boolean;
}) => {
  const rowContent = (
    <button
      onClick={onSelect}
      disabled={!canSelect}
      className={`
        w-full flex justify-between items-center px-3 py-1.5 rounded-md text-sm
        transition-all duration-150 relative block
        ${score !== null
          ? justScored 
            ? 'bg-green-100 dark:bg-green-900/30 cursor-default animate-[pulse_0.5s_ease-in-out]'
            : 'bg-gray-100 dark:bg-gray-800 cursor-default'
          : canSelect
          ? 'bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950 hover:ring-2 hover:ring-blue-400 cursor-pointer animate-[pulse_2s_ease-in-out_infinite]'
          : 'bg-gray-50 dark:bg-gray-900 opacity-50 cursor-not-allowed'
        }
      `}
    >
      <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
        {getCategoryName(category)}
      </span>
      <span className="font-bold ml-2 flex-shrink-0">
        {score !== null ? (
          <span className={justScored ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}>
            {score}
          </span>
        ) : canSelect ? (
          <span className="text-blue-600 dark:text-blue-400">{potentialScore}</span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </span>
    </button>
  );

  if (score === null && canSelect) {
    return (
      <div className="w-full">
        <Tooltip text={getCategoryDescription(category)}>
          {rowContent}
        </Tooltip>
      </div>
    );
  }

  return <div className="w-full">{rowContent}</div>;
};

export default function ScoreCard({ scores, dice, onSelectCategory, rollsLeft }: ScoreCardProps) {
  const [lastScoredCategory, setLastScoredCategory] = useState<ScoreCategory | null>(null);
  const canSelectCategory = rollsLeft < 3;

  const handleSelectCategory = (category: ScoreCategory) => {
    setLastScoredCategory(category);
    onSelectCategory(category);
    
    // Clear the animation after it completes
    setTimeout(() => {
      setLastScoredCategory(null);
    }, 1000);
  };

  const upperCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const lowerCategories: ScoreCategory[] = [
    'threeOfAKind',
    'fourOfAKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'yahtzee',
    'chance',
  ];

  const upperTotal = calculateUpperSectionTotal(scores);
  const upperBonus = calculateUpperSectionBonus(scores);
  const lowerTotal = calculateLowerSectionTotal(scores);
  const total = calculateTotalScore(scores);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Upper Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 space-y-1">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 pb-1 border-b">
          Upper Section
        </h2>
        {upperCategories.map((category) => (
          <ScoreRow
            key={category}
            category={category}
            score={scores[category]}
            potentialScore={calculateScore(dice, category)}
            onSelect={() => handleSelectCategory(category)}
            canSelect={canSelectCategory && scores[category] === null}
            justScored={lastScoredCategory === category}
          />
        ))}
        
        {/* Upper Section Totals */}
        <div className="pt-2 mt-2 border-t space-y-1">
          <div className="flex justify-between px-3 text-xs">
            <span className="text-gray-600 dark:text-gray-400">Upper Total</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{upperTotal}</span>
          </div>
          <div className="flex justify-between px-3 text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              Bonus (63+ = 35)
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{upperBonus}</span>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 space-y-1">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 pb-1 border-b">
          Lower Section
        </h2>
        {lowerCategories.map((category) => (
          <ScoreRow
            key={category}
            category={category}
            score={scores[category]}
            potentialScore={calculateScore(dice, category)}
            onSelect={() => handleSelectCategory(category)}
            canSelect={canSelectCategory && scores[category] === null}
            justScored={lastScoredCategory === category}
          />
        ))}
        
        {/* Lower Section Total */}
        <div className="pt-2 mt-2 border-t">
          <div className="flex justify-between px-3 text-xs">
            <span className="text-gray-600 dark:text-gray-400">Lower Total</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{lowerTotal}</span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">Grand Total</span>
          <span className="text-2xl font-bold text-white">{total}</span>
        </div>
      </div>
    </div>
  );
}
