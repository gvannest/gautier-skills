---
name: commit-message
tags: [diagrams-first, exception]
max_turns: 3
allowed_tools: []
---

Write a commit message for this staged diff. Output only the message.

```diff
--- a/calc.py
+++ b/calc.py
@@ -1,2 +1,3 @@
 def add(a, b):
+    """Return the sum of a and b."""
     return a + b
```
