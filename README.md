# Yahtzee Game

A modern, single-player Yahtzee game built with Next.js 16, React 19, TypeScript, and TailwindCSS v4. Features local data persistence using IndexedDB for game history and statistics tracking.

## Features

- **Classic Yahtzee Gameplay** - All standard scoring rules and 13 rounds
- **Interactive Dice** - Click to hold dice between rolls with visual feedback
- **Score Hints** - Hover over available categories to see scoring requirements
- **Visual Feedback** - Pulsing animations on available categories, score animations on selection
- **Game History** - All completed games saved to IndexedDB
- **Statistics Tracking** - View total games, high score, average score, and total Yahtzees
- **High Score Alerts** - Get notified when you beat your previous best
- **New Game Confirmation** - Prevents accidental game resets during active play
- **Responsive Design** - Optimized layout for desktop and mobile devices
- **Dark Mode Support** - Automatically adapts to system theme preferences

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **Database:** IndexedDB (client-side)
- **Package Manager:** npm

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yahtzee
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

### Game Rules

Yahtzee is a dice game where players roll five dice up to three times per turn to achieve specific scoring combinations.

### Gameplay

1. **Roll Dice** - Click the "Roll Dice" button to roll all unheld dice
2. **Hold Dice** - Click individual dice to hold them between rolls (held dice turn blue)
3. **Score Selection** - After rolling, select a category to score (you must select after 3 rolls)
4. **Complete Game** - Continue for 13 rounds until all categories are filled

### Scoring Categories

#### Upper Section
- **Ones through Sixes** - Sum of all dice showing that number
- **Bonus** - Earn 35 points if upper section totals 63 or more

#### Lower Section
- **3 of a Kind** - At least 3 dice the same (sum of all dice)
- **4 of a Kind** - At least 4 dice the same (sum of all dice)
- **Full House** - 3 of one number and 2 of another (25 points)
- **Small Straight** - Four sequential dice (30 points)
- **Large Straight** - Five sequential dice (40 points)
- **Yahtzee** - All five dice the same (50 points)
- **Chance** - Any combination (sum of all dice)

## Project Structure

```
yahtzee/
├── app/
│   ├── page.tsx           # Main game page
│   ├── stats/
│   │   └── page.tsx       # Statistics and history page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles and animations
├── components/
│   ├── Dice.tsx          # Dice display and interaction
│   └── ScoreCard.tsx     # Score tracking interface
├── lib/
│   ├── types.ts          # TypeScript type definitions
│   ├── db.ts             # IndexedDB utilities
│   └── gameLogic.ts      # Game rules and scoring logic
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data Storage

Game data is stored locally in your browser using IndexedDB. Data persists across sessions but is specific to each browser. To clear data:

1. Navigate to the Statistics page
2. Click "Clear All" to delete all game history

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 15.4+
- Edge 90+

IndexedDB support required for game history features.

## Development

### Key Components

- **Game State Management** - React hooks manage dice, rolls, scores, and round tracking
- **Score Calculation** - Pure functions validate and calculate all scoring categories
- **Animations** - CSS keyframes for dice rolling, score reveals, and visual feedback
- **Database Layer** - Async/await pattern for IndexedDB operations

### Adding New Features

1. Update types in `lib/types.ts`
2. Add logic to `lib/gameLogic.ts`
3. Update UI components as needed
4. Test thoroughly across all game states

## Contributing

This is a personal project, but suggestions and feedback are welcome.

## License

MIT License - feel free to use this project for learning or personal use.

## Acknowledgments

- Yahtzee is a trademark of Hasbro
- Built as a learning project for modern React and Next.js patterns
- Designed with accessibility and user experience in mind