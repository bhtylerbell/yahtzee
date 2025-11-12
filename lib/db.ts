// IndexedDB utilities for storing game history

import { GameResult, GameStats } from './types';

const DB_NAME = 'YahtzeeDB';
const DB_VERSION = 1;
const STORE_NAME = 'games';

let db: IDBDatabase | null = null;

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('totalScore', 'totalScore', { unique: false });
      }
    };
  });
};

// Save a completed game
export const saveGame = async (game: GameResult): Promise<number> => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(game);

    request.onsuccess = () => {
      resolve(request.result as number);
    };

    request.onerror = () => {
      reject(new Error('Failed to save game'));
    };
  });
};

// Get all games, sorted by date (newest first)
export const getAllGames = async (): Promise<GameResult[]> => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const games = request.result as GameResult[];
      // Sort by date, newest first
      games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(games);
    };

    request.onerror = () => {
      reject(new Error('Failed to retrieve games'));
    };
  });
};

// Get game statistics
export const getStats = async (): Promise<GameStats> => {
  const games = await getAllGames();
  
  if (games.length === 0) {
    return {
      totalGames: 0,
      highScore: 0,
      averageScore: 0,
      totalYahtzees: 0,
    };
  }

  const totalScore = games.reduce((sum, game) => sum + game.totalScore, 0);
  const highScore = Math.max(...games.map(game => game.totalScore));
  const totalYahtzees = games.reduce((sum, game) => {
    return sum + (game.scores.yahtzee !== null && game.scores.yahtzee > 0 ? 1 : 0);
  }, 0);

  return {
    totalGames: games.length,
    highScore,
    averageScore: Math.round(totalScore / games.length),
    totalYahtzees,
  };
};

// Delete a game by ID
export const deleteGame = async (id: number): Promise<void> => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to delete game'));
    };
  });
};

// Clear all games
export const clearAllGames = async (): Promise<void> => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to clear games'));
    };
  });
};
