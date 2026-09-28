# Refactor Plan: WordWizard AI (Old Code Alignment)

## 1. Executive Summary
Refactor the current `word-wizard-ai` codebase to align with the structure, styling, and logic found in the `old code` directory. This involves reverting to the original UI components (`App.tsx`, `BoardGrid.tsx`, etc.) while ensuring the recent backend improvements (Gemini 2.0 Flash, Coordinate Protocol, Dictionary Validation) are integrated seamlessly.

## 2. Technical Strategy
- **Structure**: Revert to the component hierarchy found in `old code`.
- **Styling**: Restore the original Tailwind CSS classes (Slate/Indigo theme) and layout.
- **Logic**: 
    - Keep the upgraded `geminiService.ts` with "Coordinate Protocol" and Gemini 2.0.
    - Keep the `dictionaryService.ts` for validation.
    - Ensure `App.tsx` uses the improved state machine but renders the "Old" UI.

## 3. Implementation Phases

### Phase 1: Component Restoration
**Goal**: Restore the visual components to their original state.
- [ ] **`BoardGrid.tsx`**: Revert to the `old code` version but ensure it accepts the new `BoardState` type.
- [ ] **`RackInput.tsx`**: Revert to the `old code` version.
- [ ] **`MoveResult.tsx`**: Revert to the `old code` version.
- [ ] **`StrategyCard.tsx`**: Revert to the `old code` version.

### Phase 2: App Logic & Layout
**Goal**: Rebuild `App.tsx` to match the old layout while using the new services.
- [ ] **`App.tsx`**: 
    - Restore the "Status Bar" (1. Upload -> 2. Verify -> 3. Solve).
    - Restore the "Input Mode" toggle (Image vs Manual).
    - Restore the original "Upload Card" design.
    - Integrate the new `processImageForAI` and `scanFullScreenshot` logic into the old `handleFileChange` flow.
    - Integrate `dictionaryService` validation into `handleSolve`.

### Phase 3: Service Integration
**Goal**: Ensure the old components communicate correctly with the new services.
- [ ] **`geminiService.ts`**: Ensure the "Coordinate Protocol" is compatible with the `BoardState` expected by the old components.
- [ ] **`types.ts`**: Verify type compatibility between old components and new services.

### Phase 4: Polish & Verification
**Goal**: Final cleanup and testing.
- [ ] **Styles**: Verify `index.css` matches the old aesthetic.
- [ ] **Build**: Ensure `npm run build` passes.
- [ ] **Manual Test**: Verify the "Upload -> Verify -> Solve" flow works as expected.

## 4. Architecture Diagram
```mermaid
[Old App.tsx UI] -> [New processImageForAI] -> [New geminiService (Vision)]
                                      |
                                      v
                                [Old BoardGrid UI] <-> [User Fixes]
                                      |
                                      v
[New dictionaryService] <-> [New geminiService (Logic)]
        ^                             |
        |                             v
        +------------------------ [Old MoveResult UI]
```