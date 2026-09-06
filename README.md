# Sudoku Classic PWA

A zero-cost, ad-free, mobile-first Progressive Web App (PWA) for Sudoku with clean classic newspaper typography and offline play, deployable on Cloudflare Pages.

## Features

- **Mobile-First Responsive Grid**: 9x9 board with distinct 3x3 block borders, hairline cell dividers, and high-contrast styling optimized for touch devices.
- **Visual Assistance**:
  - Selected row, column, and 3x3 box crosshair shading.
  - Same-digit matching highlight.
  - Optional auto-check error indicators.
- **Dual Input Modes**:
  - **Cell-First**: Tap any cell, then tap a digit on the keypad.
  - **Digit-First**: Select a digit on the keypad, then rapidly tap multiple cells across the board.
- **Dual-Layer Pencilmarks**:
  - **Corner Notes**: Candidate digits in corner/perimeter positions.
  - **Center Notes**: Candidate digits clustered in the center.
  - **Auto-Erasure**: Placing a digit automatically removes that candidate note from all peer cells in the same row, column, and 3x3 box.
- **Move History & Persistence**:
  - Full Undo / Redo stack.
  - Automatic persistence to `localStorage` (board state, notes, timer, history, and career statistics persist across page reloads).
  - Anti-peeking pause overlay with timer stop.
- **QQWing Puzzle Engine in Web Worker**:
  - Generates boards off-thread via a dedicated Web Worker (`src/workers/generator.worker.ts`) with background pre-caching.
  - Guaranteed 180° rotational symmetry and exactly 1 unique solution.
  - Logical difficulty presets:
    - **Easy**: Solvable using Singles and Hidden Singles only.
    - **Medium**: Requires Naked/Hidden pairs, triples, and pointing pairs.
    - **Hard**: Requires Box/Line reductions, X-Wings, and subsets.
- **Offline PWA**:
  - Service worker caching via `vite-plugin-pwa` and Workbox.
  - Installable to home screen (`display: standalone`).

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` with `@import "tailwindcss";`)
- **Puzzle Engine**: `qqwing`
- **Icons**: `lucide-react`
- **Effects**: `canvas-confetti`
- **Hosting Target**: Cloudflare Pages / Workers via `wrangler`

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Cloudflare Pages
```bash
npm run deploy
```

For detailed configuration, API token permissions, and CI/CD pipelines, see the [Deployment Runbook](DEPLOYMENT.md).

## License

This project is licensed under the GNU General Public License v2.0 (GPL-2.0). See [LICENSE.md](LICENSE.md) for details.
