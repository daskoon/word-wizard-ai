---
id: vision01
title: Implement Auto-Vision (11x11 Grid & Rack)
status: Triage
priority: Urgent
project: WordWizard
created: 2026-01-20
updated: 2026-01-20
links:
  - url: ../linear_ticket_parent.md
    title: Parent Ticket
labels: [vision, ai]
assignee: Pickle Rick
---

# Description

## Problem to solve
Users are currently forced to manually crop screenshots because the model can't find the board in a full Messenger screenshot.

## Solution
Update `geminiService.ts` to use Gemini 2.0 Flash with a system instruction specifically tuned for Facebook Messenger 11x11 screenshots.
- Target the 11x11 grid landmarks (Green TL corners).
- Target the 7-slot yellow rack.
- Return a compact 121-char string for the board and a string for the rack.
- Implement client-side image resizing (max 1024px) to reduce latency.
