# 🥒 WordWizard AI - Session Summary (v4.0)

**Date**: 2026-01-20
**Final Status**: ✅ Functional & Polished

## 1. The Journey
- **Initial State**: "Poo Poo". Manual cropping required. Vision failed on full screenshots.
- **Iteration 1 (Refactor)**: Added `ImageCropper`. Still fragile.
- **Iteration 2 (Cyberpunk)**: Attempted a dark-mode "Hacker" aesthetic. Resulted in poor usability ("Monday's Ass").
- **Iteration 3 (Coordinate Protocol)**: Switched vision logic from string-based to coordinate-based. Improved accuracy but UI was still broken.
- **Iteration 4 (The Revival)**: Reverted UI to the clean, professional "Old Version" look (Slate/Indigo). Refined Vision to strictly ignore Facebook/Messenger UI noise.

## 2. Current Architecture (v4.0)

### 🧠 The "Optic Nerve" (Vision)
- **Model**: `gemini-2.0-flash` (Fast, Multimodal).
- **Protocol**: **Coordinate JSON**.
    - Instead of guessing a string, the AI returns an array: `[{ r: 0, c: 0, L: 'T' }, ...]`.
    - It uses the Green 'TL' corners as anchors (0,0 and 10,10) to map the grid.
    - Explicitly ignores Facebook ads, chat bubbles, and nav bars.
- **Preprocessing**: Client-side canvas resizes images to ~1200px width with +10% contrast to make grid lines pop.

### 🧠 The "Grandmaster" (Logic)
- **Model**: `gemini-2.0-flash` (Upgraded from 1.5).
- **Dictionary Guard**: Client-side validation using the **ENABLE** word list + a custom **WWF Whitelist** (QI, ZA, etc.).
- **Strategy**: Calculates multipliers (DL/TL/DW/TW) only on *newly* placed tiles.

### 🎨 The Interface (UI)
- **Style**: "Modern Utility". High-contrast Slate 50 background, White cards, Indigo 600 accents.
- **Layout**: Single-column mobile-first design. No overlapping headers.
- **Feedback**: Simple progress bar (Scanning -> Thinking -> Complete).

## 3. Key Files
| File | Purpose |
| :--- | :--- |
| `src/App.tsx` | Main controller. Handles image upload, resizing, and state flow. |
| `src/services/geminiService.ts` | The Brains. Contains the `VISION_SYSTEM_INSTRUCTION` and `scanFullScreenshot`. |
| `src/services/dictionaryService.ts` | The Guard. Validates words against the lexicon. |
| `src/components/BoardGrid.tsx` | The Board. Rendered with high-fidelity "Tile" aesthetics. |
| `src/components/MoveResult.tsx` | The Output. Displays the best move, score breakdown, and strategy. |

## 4. How to Run
1.  **Install**: `npm install`
2.  **Start**: `npm run dev`
3.  **Play**:
    - Upload a raw Facebook Messenger screenshot (11x11 Solo).
    - Watch the progress bar.
    - If Vision misses a tile, tap the grid to fix it manually.
    - Click "Find Best Move".

## 5. Known Constraints
- **11x11 Only**: Optimized strictly for the Solo Challenge board. Standard 15x15 boards may misalign.
- **Facebook Messenger**: Tuned for this specific UI layout. Other versions (Snapchat, standalone app) might need prompt tweaking.
