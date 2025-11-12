'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Dice from '@/components/Dice';
import ScoreCard from '@/components/ScoreCard';
import { GameState, ScoreCategory } from '@/lib/types';
import { 
  initializeDice, 
  rollDice, 
  initializeScoreCard, 
  calculateScore,
  calculateTotalScore,
  calculateUpperSectionTotal,
  calculateUpperSectionBonus,
  calculateLowerSectionTotal,
} from '@/lib/gameLogic';
import { saveGame, getStats } from '@/lib/db';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    dice: initializeDice(),
    rollsLeft: 3,
    scores: initializeScoreCard(),
    round: 1,
    gameOver: false,
  });

  const [isRolling, setIsRolling] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Load high score on mount
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const stats = await getStats();
        setHighScore(stats.highScore);
      } catch (error) {
        console.error('Failed to load high score:', error);
      }
    };
    loadHighScore();
  }, []);

  const handleRoll = () => {
    if (gameState.rollsLeft > 0 && !isRolling) {
      setIsRolling(true);
      
      // Simulate dice roll animation
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          dice: rollDice(prev.dice),
          rollsLeft: prev.rollsLeft - 1,
        }));
        setIsRolling(false);
      }, 200);
    }
  };

  const handleToggleHold = (index: number) => {
    // Can only hold dice after first roll
    if (gameState.rollsLeft < 3) {
      setGameState(prev => ({
        ...prev,
        dice: prev.dice.map((die, i) =>
          i === index ? { ...die, held: !die.held } : die
        ),
      }));
    }
  };

  const handleSelectCategory = (category: ScoreCategory) => {
    if (gameState.scores[category] !== null || gameState.rollsLeft === 3) {
      return;
    }

    const score = calculateScore(gameState.dice, category);
    const newScores = { ...gameState.scores, [category]: score };
    const isLastRound = gameState.round === 13;

    setGameState(prev => ({
      ...prev,
      scores: newScores,
      round: prev.round + 1,
      rollsLeft: 3,
      dice: initializeDice().map(die => ({ ...die, held: false })),
      gameOver: isLastRound,
    }));

    // Save game if it's over
    if (isLastRound) {
      setShowGameOver(true);
      saveGameToDb(newScores);
    }
  };

  const saveGameToDb = async (finalScores: typeof gameState.scores) => {
    try {
      const finalScore = calculateTotalScore(finalScores);
      await saveGame({
        date: new Date().toISOString(),
        scores: finalScores,
        totalScore: finalScore,
        upperSectionTotal: calculateUpperSectionTotal(finalScores),
        upperSectionBonus: calculateUpperSectionBonus(finalScores),
        lowerSectionTotal: calculateLowerSectionTotal(finalScores),
      });
      
      // Check if new high score
      if (highScore === null || finalScore > highScore) {
        setIsNewHighScore(true);
        setHighScore(finalScore);
      }
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const handleNewGameClick = () => {
    // Show confirmation if game is in progress
    if (gameState.round > 1 && !gameState.gameOver) {
      setShowNewGameConfirm(true);
    } else {
      startNewGame();
    }
  };

  const startNewGame = () => {
    setGameState({
      dice: initializeDice(),
      rollsLeft: 3,
      scores: initializeScoreCard(),
      round: 1,
      gameOver: false,
    });
    setShowGameOver(false);
    setShowNewGameConfirm(false);
    setIsNewHighScore(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🎲 Yahtzee
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Round {gameState.round} of 13
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewGameClick}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                       text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg text-sm
                       transition-colors"
            >
              New Game
            </button>
            <Link 
              href="/stats" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Statistics →
            </Link>
          </div>
        </div>

        {/* New Game Confirmation Modal */}
        {showNewGameConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Start New Game?
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                You&apos;re currently on round {gameState.round} of 13. Starting a new game will lose your current progress.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewGameConfirm(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startNewGame}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Start New Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {showGameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                {isNewHighScore ? '� New High Score!' : '�🎉 Game Over!'}
              </h2>
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-2">Your final score:</p>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 animate-[scoreReveal_0.5s_ease-out]">
                  {calculateTotalScore(gameState.scores)}
                </p>
                {isNewHighScore && (
                  <p className="text-green-600 dark:text-green-400 font-semibold mt-2 animate-[slideUp_0.5s_ease-out]">
                    You beat your previous best of {highScore && highScore !== calculateTotalScore(gameState.scores) ? highScore : 'N/A'}!
                  </p>
                )}
                {!isNewHighScore && highScore !== null && highScore > 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    High Score: {highScore}
                  </p>
                )}
              </div>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Upper Section:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {calculateUpperSectionTotal(gameState.scores)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bonus:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {calculateUpperSectionBonus(gameState.scores)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lower Section:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {calculateLowerSectionTotal(gameState.scores)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startNewGame}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  New Game
                </button>
                <Link
                  href="/stats"
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  View Stats
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-4 items-start">
          {/* Left Column - Dice and Controls */}
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Your Dice
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
                {gameState.rollsLeft === 3 
                  ? 'Click "Roll Dice" to start' 
                  : gameState.rollsLeft > 0
                  ? 'Click dice to hold them, then roll again'
                  : 'Select a category to score'}
              </p>
              
              <Dice 
                dice={gameState.dice} 
                onToggleHold={handleToggleHold}
                disabled={gameState.rollsLeft === 3 || gameState.rollsLeft === 0}
                isRolling={isRolling}
              />

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rolls Left:
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {gameState.rollsLeft}
                  </span>
                </div>
                
                <button
                  onClick={handleRoll}
                  disabled={gameState.rollsLeft === 0 || isRolling || gameState.gameOver}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                           text-white font-bold py-3 px-4 rounded-lg text-base
                           transition-all duration-150 shadow-md hover:shadow-lg
                           disabled:cursor-not-allowed disabled:hover:shadow-md
                           active:scale-95"
                >
                  {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
                </button>

                {gameState.rollsLeft === 0 && !gameState.gameOver && (
                  <p className="text-center text-amber-600 dark:text-amber-400 text-xs font-medium">
                    Choose a category to score
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Score Card */}
          <div>
            <ScoreCard
              scores={gameState.scores}
              dice={gameState.dice}
              onSelectCategory={handleSelectCategory}
              rollsLeft={gameState.rollsLeft}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
