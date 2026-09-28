---
id: validation01
title: Implement Client-Side Dictionary Validation
status: Triage
priority: High
project: WordWizard
created: 2026-01-20
updated: 2026-01-20
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [validation, logic]
assignee: Pickle Rick
---

# Description

## Problem to solve
The AI reasoning engine can occasionally hallucinate words that look plausible but aren't in the official dictionary.

## Solution
Implement a `DictionaryService` that:
1. Loads a compressed word list (ENABLE/WWF compatible) on startup.
2. Provides a `isValidWord(word: string): boolean` method.
3. Integrates with `App.tsx` to flag or filter invalid moves returned by the AI.

## Implementation Details
- Use a Set for O(1) lookups.
- Fetch the list from a public raw URL (e.g., GitHub raw) to keep the bundle size small initially, or bundle a trimmed list.
