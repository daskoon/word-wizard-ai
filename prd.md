# WordWizard AI - God Mode PRD

## HR Eng
| Feature | WordWizard AI Refactor |
| :--- | :--- |
| **Author** | Pickle Rick |
| **Status** | Draft |
| **Created** | 2026-01-20 |

## Introduction
WordWizard AI is a mobile-first web app that helps users dominate the "Words With Friends" Solo Challenge (11x11 board). The goal is to maximize score, clear the rack, or play defensively. The current iteration is a buggy, manual-crop mess. We are rebuilding it to be fully automated, highly accurate, and visually stunning.

## Problem Statement
- **Current State**: Users have to manually crop screenshots. Vision fails on full screenshots. UI is basic.
- **Pain Points**: Slow workflow, high friction, frequent AI hallucinations (invalid words), boring UI.
- **Goal**: Create a seamless "Upload -> Win" experience.

## Objective & Scope
**Objective**: Build the ultimate WWF assistant, specifically optimized for the **Facebook Messenger 11x11 variant**.
**Ideal Outcome**: User uploads a screenshot -> App instantly renders the digital board -> App suggests the best move with explanation.

### In-Scope
- **Auto-Vision**: Detect 11x11 grid and rack from **Facebook Messenger** screenshots (which include Messenger UI bars, chat bubbles, and platform-specific overlays) without manual cropping.
- **Game Logic**: Calculate optimal moves for "Max Score", "Defensive", and "Clear Rack".
- **Validation**: Client-side dictionary check (if feasible size-wise) or secondary AI verification step.
- **UI/UX**: Cyberpunk/Neon aesthetic. Dark mode. Smooth animations (Framer Motion).
- **Tech Stack**: React 19, Vite, Tailwind v4, Gemini 2.0 Flash (Vision), Gemini 2.0 Pro (Logic).

### Out-of-Scope
- 15x15 Standard Board (Strictly 11x11 Solo Mode for now, unless we want to support both dynamically). *Correction: User mentioned "not for solo play" in the chat, implying they might WANT 15x15 support. I will design the Vision system to be dynamic or selectable.* -> **DECISION: Support BOTH 11x11 and 15x15.**

## Product Requirements

### Critical User Journeys (CUJs)
1.  **The "One-Tap Win"**: User takes a screenshot -> Opens Web App -> Uploads Image -> App Auto-Detects Board -> App Shows Best Move.
2.  **The "Manual Override"**: Vision misses a tile -> User taps the tile on the grid -> User fixes the letter -> App Recalculates.

### Functional Requirements
| Priority | Requirement | Description |
| :--- | :--- | :--- |
| **P0** | **Auto-Vision** | ingest full screenshot, identify grid size (11 vs 15), extract board state + rack. |
| **P0** | **Move Gen** | Generate valid, high-scoring moves using Gemini 2.0 Pro. |
| **P0** | **Visuals** | "God Mode" UI. Dark, Neon, Fast. |
| **P1** | **Dictionary** | Validate words against a known word list (enable/disable in settings). |
| **P1** | **History** | Remember previous uploads/games (Local Storage). |

## Technical Architecture
- **Frontend**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS v4 + Framer Motion.
- **State**: React Context or Zustand (cleaner than prop drilling).
- **AI**:
    -   `VisionService`: Sends image to Gemini 2.0 Flash. Prompts for JSON output: `{ "board": string[], "rack": string }`.
    -   `GameService`: Sends state to Gemini 2.0 Pro. Prompts for JSON output: `{ "moves": [ { "word": string, "score": number, "coords": ... } ] }`.

## Risks
- **AI Hallucination**: Model invents words. *Mitigation: Dictionary check.*
- **Vision Failure**: Model misses the grid in complex screenshots. *Mitigation: Fallback to manual crop if auto-detection confidence is low.*

## Success Metrics
- **Accuracy**: >95% accurate board extraction on first try.
- **Speed**: <5 seconds from Upload to Solution.
