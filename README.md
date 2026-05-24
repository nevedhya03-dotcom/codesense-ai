# 🔍 CodeSense AI — AI-Powered Code Review Assistant

> Instantly detect bugs, security vulnerabilities, performance bottlenecks, and code smells using Claude Sonnet 4.

![CodeSense AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204-00d4ff?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Hackathon](https://img.shields.io/badge/Hackathon-2025-ff6b6b?style=flat-square)

---

## 🚀 Live Demo

**[→ codesense-ai.vercel.app](https://codesense-ai.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **GitHub PR Review** | Paste any public GitHub PR URL — CodeSense fetches the diff and reviews it live |
| 📋 **Code Paste Mode** | Paste raw code in 12+ languages for instant AI review |
| 🐛 **Bug Detection** | Catches logic errors, null references, off-by-one errors, and more |
| 🔐 **Security Scanning** | Identifies SQL injection, XSS, hardcoded secrets, insecure patterns |
| ⚡ **Performance Analysis** | Finds N+1 queries, memory leaks, inefficient algorithms |
| 🎨 **Style & Best Practices** | Enforces clean code principles and language-specific conventions |
| 📊 **Quality Score** | 0–100 code quality score with animated ring visualization |
| ✅ **Positive Feedback** | Highlights what the code does well, not just what's wrong |

---

## 🛠️ Tech Stack

- **Frontend** — React 18, vanilla CSS, Google Fonts (Syne, DM Sans, JetBrains Mono)
- **AI** — Anthropic Claude Sonnet 4 via REST API
- **Data** — GitHub REST API v3 (public repos, no auth required)
- **Deployment** — Vercel (CI/CD from GitHub)

---

## 📦 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com))

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/codesense-ai.git
cd codesense-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root:
```env
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

> **Note:** For production, use a backend proxy to keep your API key secure.
> The live demo uses Anthropic's artifact sandbox (no key needed).

### 4. Start the development server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploy to Vercel

### Option A — One-click deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/codesense-ai)

### Option B — CLI deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

---

## 🎯 How It Works

```
User Input
    │
    ├─ GitHub PR URL ──► GitHub API ──► Fetch PR diff (patch)
    │                                        │
    └─ Pasted Code ───────────────────────────┤
                                              │
                                              ▼
                                   Claude Sonnet 4 (AI)
                                   Structured JSON prompt
                                              │
                                              ▼
                               ┌──────────────────────────┐
                               │  score · summary · stats │
                               │  issues (top 5, ranked)  │
                               │  positives               │
                               └──────────────────────────┘
                                              │
                                              ▼
                                      React UI renders
                               Score Ring · Stat Cards · 
                               Expandable Issue Cards · Filters
```

---

## 📁 Project Structure

```
codesense-ai/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main component (CodeSenseAI)
│   └── index.js        # React entry point
├── vercel.json         # Vercel deployment config
├── package.json
└── README.md
```

---

## 🔮 Roadmap

- [ ] Multi-file PR analysis (currently reviews the primary changed file)
- [ ] GitHub OAuth for private repository support
- [ ] Inline diff view with highlighted issues per line
- [ ] Export review as PDF / Markdown
- [ ] VS Code extension integration
- [ ] Team dashboard for review history

---

## 👤 Author

**Nevedhya Patni**  
Software Engineer — AI & Automation  
[GitHub](https://github.com/nevedhya03-dotcom) · [LinkedIn](https://linkedin.com/in/nevedhya-patni-978601324) · nevedhya03@gmail.com

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

*Built with ❤️ during a 2-day hackathon · May 2025*
