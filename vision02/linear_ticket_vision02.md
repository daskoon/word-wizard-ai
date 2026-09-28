---
id: vision02
title: Implement Coordinate-Based Vision Protocol
status: Triage
priority: Urgent
project: WordWizard
created: 2026-01-20
updated: 2026-01-20
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [vision, refactor]
assignee: Pickle Rick
---

# Description

## Problem to solve
The 'Compact Protocol' (121-char string) is failing on complex screenshots because the model gets lost in the noise (Facebook ads, UI bars). It hallucinates tiles from the UI text.

## Solution
Switch to a **Coordinate-Based Protocol**.
Instead of asking for a string `..........`, ask for a sparse array of detected tiles:
```json
{
  "board": [
    { "r": 3, "c": 5, "L": "A" },
    { "r": 3, "c": 6, "L": "P" }
  ],
  "rack": "BLTESJ"
}
```
This forces the model to explicitly assign a row/col to every letter it finds, reducing hallucinations from random text (which won't fit the grid geometry).

## Implementation Details
- Update `geminiService.ts` prompt and schema.
- Update `App.tsx` or `geminiService.ts` to parse this new format back into `BoardState`.
