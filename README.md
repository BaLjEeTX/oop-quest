# ⚔️ OOP Quest

A quest-style RPG that teaches **Object-Oriented Programming in Java — from zero to LLD-interview ready.**

Name a hero, travel a 5-Act map, clear quests, defeat bosses, earn XP and badges. By the end you have covered everything an LLD (Low-Level Design) interview tests.

## What it teaches

- **Act I — Foundations:** classes & objects, fields/methods, constructors, encapsulation
- **Act II — The Four Pillars:** abstraction, inheritance, polymorphism, interfaces
- **Act III — The SOLID Temple:** all five SOLID principles (S, O, L, I, D), one quest each
- **Act IV — The Pattern Atelier:** Singleton, Factory, Strategy, Observer
- **Act V — The Advanced Atelier:** Builder, Decorator, Adapter, Command
- **Act VI — The LLD Arena:** a repeatable 7-step method for any design problem, plus full walk-throughs of five classics — Parking Lot, Elevator, Vending Machine, LRU Cache, and Splitwise (expense sharing)

33 quests · 150+ challenges · 6 bosses. Challenges mix multiple-choice, fill-in-the-blank, and **write-real-Java** tasks graded by a pattern checker.

## The Interview Simulator

The 🎯 Interview button opens a set of **open-ended LLD problems** — Tic-Tac-Toe, Library Management, Movie Ticket Booking, and an API Rate Limiter. There is no multiple choice: you write your design in plain words (classes, relationships, patterns, edge cases), and the game scores your concept coverage against a rubric, then reveals a full model answer. This is the closest practice to the real interview round.

## The Code Forge

A built-in **live Java sandbox** (the 🔨 Forge button). Write real Java, load curated demos, and actually run them — the server compiles and executes your code on a JVM and shows the console output. Code challenges also get a **"Compile on a real JVM"** button for genuine compiler feedback alongside the instant structural checks.

## Run it

You need [Node.js](https://nodejs.org) (v16 or newer).

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

**Optional:** to enable live Java execution (the Code Forge and the compile buttons), have **Java 11 or newer** installed and on your `PATH`. The game detects it automatically on startup. Without Java the game is still 100% playable — code challenges simply use the structural checker only.

## Deploying

To host the game publicly (e.g. on AWS with a custom domain), see **[DEPLOY.md](DEPLOY.md)**. It walks through provisioning a server, a custom URL with HTTPS, and — importantly — running all learner-submitted Java inside a **locked-down Docker sandbox** (`sandbox/Dockerfile`): no network, read-only filesystem, capped CPU/memory, and a hard time limit. Never expose the `direct` execution mode publicly.

## How it works

| File | Role |
|------|------|
| `server.js` | Express server — serves the game, saves progress, runs the leaderboard, and executes Java via `/api/run-java` |
| `public/index.html` | Page shell |
| `public/css/style.css` | The fantasy-RPG look |
| `public/js/curriculum.js` | The entire 0→advanced curriculum, as data |
| `public/js/simulations.js` | Open-ended LLD problems, rubrics and model answers for the Interview Simulator |
| `public/js/checker.js` | Pattern-based Java code analyser for the coding challenges |
| `public/js/game.js` | Game engine — world map, quests, bosses, XP, badges, Code Forge, Interview Simulator |

Progress is saved per hero name on the server, with a `localStorage` fallback so the game still works offline. Use a hero name again later to continue your saga.

Live Java execution uses the **Java 11+ single-file source launcher** (`java File.java`), so a plain JRE is enough — no JDK or `javac` required. Submissions run with an 8-second timeout to guard against infinite loops.

## Notes

Code challenges are graded by a **structural pattern checker** — it verifies your code has the right shape (correct class, fields, modifiers, methods), which is instant and works fully offline. When Java is installed you additionally get **real compilation and execution**, so you can see your code actually run. The goal throughout is to train the design instincts an interviewer is grading.
