# 🎬 CodeSense AI — 3-Minute Demo Script

> Use this as your guide for recording the submission video.
> Target: exactly 3 minutes. Practice twice before recording.

---

## ⏱️ Timeline

| Time      | Section            | What to do                          |
|-----------|--------------------|-------------------------------------|
| 0:00–0:30 | Hook + Problem     | Start strong, state the problem     |
| 0:30–1:00 | Solution intro     | Show the UI, explain features       |
| 1:00–2:00 | Live demo (PR URL) | Demo the GitHub PR analysis         |
| 2:00–2:40 | Live demo (paste)  | Demo paste mode with buggy code     |
| 2:40–3:00 | Close + impact     | Wrap up, state real-world value     |

---

## 🎙️ Full Script

### [0:00 – 0:30] HOOK — The Problem

> *Show a GitHub PR page with 40+ files changed*

"Every engineering team reviews code manually. A developer opens a pull request, and a senior engineer has to read through hundreds of lines — hunting for bugs, checking for security holes, spotting performance issues.

It takes hours. And things get missed.

I built **CodeSense AI** to fix that."

---

### [0:30 – 1:00] SOLUTION INTRO

> *Show the CodeSense AI homepage*

"CodeSense AI is an AI-powered code review assistant. You give it a GitHub pull request URL — or paste raw code — and within seconds it gives you a complete, structured review.

It detects bugs, security vulnerabilities, performance bottlenecks, and style issues — powered by Claude Sonnet 4.

Let me show you how it works."

---

### [1:00 – 2:00] LIVE DEMO — GitHub PR Mode

> *Switch to the PR URL tab. Have a real public PR URL ready.*
> 
> Suggested PRs to use (public, with real code changes):
> - https://github.com/facebook/react/pull/30000 (or any recent one)
> - Or find one on trending repos at github.com/explore

"I'll paste a real GitHub pull request URL here."

> *Paste the URL, click Analyze Code*

"CodeSense fetches the PR diff directly from GitHub's API — no login needed for public repos. Then it sends the code to Claude for analysis."

> *Wait for results to appear — narrate as they load*

"Here's the quality score — this PR got a 72 out of 100."

> *Point to stat cards*

"It found 1 bug, 2 security issues, and 1 performance concern."

> *Click on a critical issue to expand it*

"This critical issue — let me open it — it's a potential SQL injection vulnerability. It explains exactly what's wrong, shows the relevant code, and gives a specific fix."

> *Scroll through other issues*

"And at the bottom — the positives. Good error handling, clean function structure."

---

### [2:00 – 2:40] LIVE DEMO — Paste Code Mode

> *Switch to Paste Code tab. Have this buggy JS ready to paste:*

```javascript
async function getUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  const result = await db.query(query);
  const password = "admin123";
  for (let i = 0; i <= result.length; i++) {
    console.log(result[i].name);
  }
  return result;
}
```

"Now let me show the paste mode. I'll drop in some code with intentional problems."

> *Paste the code, select JavaScript, click Analyze*

"This code has SQL injection, a hardcoded password, and an off-by-one error in the loop. Let's see if CodeSense catches all of them."

> *Results appear*

"Score: 38. Critical security issue — SQL injection. High — hardcoded credentials. Medium — loop boundary error. Three for three."

---

### [2:40 – 3:00] CLOSE

"CodeSense AI turns a multi-hour manual review into a 10-second automated scan.

It's built with React, the GitHub API, and Claude Sonnet 4. It's deployed, it's live, and it's ready for real engineering teams to use today.

Thank you."

---

## 🎥 Recording Tips

- **Screen record** at 1920×1080 — use OBS, Loom, or Quicktime
- **Zoom in** on results when explaining issues (⌘+ on Mac, Ctrl+ on Windows)
- **Slow down** on the issue expansion — that's the most impressive moment
- **Have the PR URL pre-copied** — don't waste time typing during demo
- **Dark room, good mic** — audio quality matters more than video
- **Keep energy up** — speak clearly and confidently

## 📝 Pre-Demo Checklist

- [ ] Test the PR URL before recording — confirm it returns results
- [ ] Have the buggy code snippet pre-written and ready to paste
- [ ] App is open and loaded (no loading lag at start)
- [ ] Browser zoom at 100% (or 110% for readability)
- [ ] Close notifications / Do Not Disturb enabled
- [ ] Practiced run-through done at least twice
