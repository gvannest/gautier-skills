---
name: schedule-explanation
tags: [diagrams-first, type-selection]
max_turns: 3
allowed_tools: []
---

Explain how to plan a four-week database migration: one week of schema changes, then two weeks of backfill that start once the schema is done, with dual writes running alongside the backfill, and a final week for cutover and cleanup.
