'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GameResult, GameStats } from '@/lib/types';
import { getAllGames, getStats, deleteGame, clearAllGames } from '@/lib/db';

export default function StatsPage() {
  const [games, setGames] = useState<GameResult[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gamesData, statsData] = await Promise.all([
        getAllGames(),
        getStats(),
      ]);
      setGames(gamesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id: number | undefined) => {
    if (id === undefined) return;
    
    try {
      await deleteGame(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllGames();
      await loadData();
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Failed to clear games:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Statistics
          </h1>
          <Link 
            href="/" 
            className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Game
          </Link>
        </div>

        {/* Stats Overview */}
        {stats && stats.totalGames > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Games
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalGames}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                High Score
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.highScore}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Average Score
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.averageScore}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Yahtzees
              </div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.totalYahtzees}
              </div>
            </div>
          </div>
        )}

        {/* Game History */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Game History
            </h2>
            {games.length > 0 && (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No games played yet
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Play Your First Game
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Score
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Upper
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Bonus
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Lower
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Yahtzee
                    </th>
                    <th className="text-right py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game, index) => (
                    <tr 
                      key={game.id || index}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(game.date)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                        {game.totalScore}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {game.upperSectionTotal}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {game.upperSectionBonus}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {game.lowerSectionTotal}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">
                        {game.scores.yahtzee !== null && game.scores.yahtzee > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400">✓</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirm Delete Modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Clear All Games?
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                This will permanently delete all game history. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
