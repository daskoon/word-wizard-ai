# Project Handover: WordWizard AI (WWF Assistant)

## 1. Executive Summary
**Project Name:** WordWizard AI
**Purpose:** A mobile-first web application that acts as an intelligent assistant for the "Words With Friends" (Solo Challenge) 11x11 game mode.
**Core Mechanism:** The app takes a screenshot of a game board, uses Multimodal AI (Gemini Flash) to parse the game state, and then uses a Reasoning AI (Gemini Pro) to calculate the optimal move.
**Current Status:** Functional MVP with significant UI polish, but suffers from reliability issues regarding computer vision on full uncropped screenshots.

## 2. Technical Stack & Environment
- **Framework:** React 19 (Client-side only, Create React App / Vite style).
- **Language:** TypeScript (Strict typing preferred).
- **Styling:** Tailwind CSS (Utility-first, heavily dependent on Slate/Indigo color palettes).
- **Icons:** Lucide React.
- **AI Provider:** Google Gemini API (@google/genai SDK).
- **Vision Model:** gemini-3-flash-preview (Optimized for speed/cost).
- **Logic Model:** gemini-3-pro-preview (Optimized for complex reasoning).
- **State Management:** React useState / useRef (No Redux/Zustand currently).

## 3. Architecture & Data Flow
**The "Compact Protocol"**
To reduce latency, the application avoids verbose JSON for the Vision step.
- **Request:** Compressed grayscale JPEG (Base64).
- **Response Schema:**
```json
{
  "r": "ABCDEFG", // Rack tiles
  "b": "..."      // Flattened 121-char string (11x11) representing the board.
}
```
**Pipeline Steps:**
1. **Ingestion:** User selects an image.
2. **Preprocessing (Client-Side):**
   - Image is drawn to canvas.
   - Resized to max 800px width.
   - Converted to Grayscale.
   - Contrast increased (1.2x).
   - Exported as low-quality JPEG to minimize payload size.
3. **Vision Analysis (Gemini Flash):** Extracts the "r" (rack) and "b" (board string).
4. **Verification (UI):** User sees the digital twin of the board and can manually correct errors using the BoardGrid component.
5. **Solving (Gemini Pro):** The App sends the board state + game mode (Max Score, Defensive, Bingo) to the reasoning model.
6. **Rendering:** The AI returns a JSON object with the best move, score breakdown, and strategy text, rendered by MoveResult.

## 4. Component Structure
- `App.tsx`: The state machine. Handles the transition between idle, scanning, ready_to_solve, and complete. Contains the image preprocessing logic.
- `services/geminiService.ts`: The API layer. Contains the specific prompt engineering for "Optic Nerve" (Vision) and "Grandmaster" (Logic).
- `components/BoardGrid.tsx`: Interactive 11x11 grid. Handles coordinate logic, tile placement, and editability.
- `components/RackInput.tsx`: 7-slot input for managing user tiles.
- `components/MoveResult.tsx`: Displays the high-level score and visualization toggle.
- `components/StrategyCard.tsx`: Displays the "Why" behind the move.
- `components/ImageCropper.tsx`: **CRITICAL NOTE:** This component exists in the filesystem but is currently disconnected in App.tsx. This is a major source of vision failure.

## 5. What Works vs. What Doesn't
**What Works ✅**
- Logic Generation: Excellent at finding high-scoring moves.
- UI Aesthetics: Modern Tailwind design.
- Client-Side Optimization: Grayscale/resize logic reduces latency.
- Board Interaction: Manual corrections work.

**What Doesn't Work / Pain Points ❌**
- Full Screenshot Vision: Confused by UI elements (battery bar, ads).
- Missing Cropping Step: `ImageCropper.tsx` is implemented but not instantiated.
- 11x11 vs 15x15 Confusion: Occasional hallucinations of standard Scrabble size.
- Hallucinations: Low contrast tiles are missed.

## 6. Known Issues & "Gotchas"
- **Board Geometry:** Hardcoded for 11x11.
- **API Rate Limits:** Free tier limitations.
- **Race Conditions:** State de-sync on rapid clicks.

## 7. Roadmap for Refactoring
**Step 1: Integrate The Cropper (High Priority)**
- User uploads image -> ImageCropper overlay -> Crop 11x11 grid -> Send to Gemini.

**Step 2: Refine Vision Prompts**
- Handle different board themes/skins.

**Step 3: Shift to Structured Output (Schema)**
- Change from string parsing to `responseSchema` with `Type.ARRAY` of `Type.STRING`.

**Step 4: Add Dictionary Validation**
- Client-side dictionary check.

## 8. File Manifest (For Context)
- `src/index.tsx`
- `src/App.tsx`
- `src/services/geminiService.ts`
- `src/components/BoardGrid.tsx`
- `src/types.ts`
- `src/constants.ts`
