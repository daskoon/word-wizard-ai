---
id: logic01
title: Implement Game Logic (Gemini 2.0 Pro)
status: Triage
priority: Urgent
project: WordWizard
created: 2026-01-20
updated: 2026-01-20
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [logic, ai]
assignee: Pickle Rick
---

# Description

## Problem to solve
The AI needs to find the actual best move based on WWF rules, not just guess.

## Solution
Implement `solveBoardStream` using Gemini 2.0 Pro.
- Pass the 11x11 board state and rack tiles.
- Support Game Modes: Max Score, Defensive, Bingo.
- Return structured JSON with the best move, alternatives, and strategic reasoning.
- Add client-side dictionary validation (optional but recommended) to avoid hallucinations.
