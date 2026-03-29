# PrepForge — Fullstack Interview Prep App

Your personal, LeetCode-style interview prep app. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **30+ curated questions** across 10 fullstack topics
- **3 difficulty levels**: Fresher / Intermediate / Advanced
- **Frequency rating** (1–5) — know which questions get asked most
- **Status tracking**: Unseen → Reviewing → Known (saved in localStorage)
- **Quiz mode** — flashcard-style rapid-fire practice with results summary
- **Bookmarks** — save questions for focused review sessions
- **Streak counter** — tracks daily study consistency
- **Search + filters** — filter by level, topic, sort by frequency/status
- **Code examples** — expandable syntax-highlighted code blocks
- **Progress bar** — visual completion %
- **Responsive** — works on mobile too

## Topics Covered

| Topic | Questions |
|-------|-----------|
| JavaScript | Closures, Event Loop, var/let/const, Promises, this/call/apply, Prototypes, Debounce/Throttle, ES6+ |
| React | Hooks deep-dive, Virtual DOM, useMemo/useCallback, useEffect, Prop drilling, Custom hooks |
| TypeScript | interface vs type, Utility types, Type narrowing, Discriminated unions |
| Node.js | Concurrency model, Express middleware, JWT auth, Error handling |
| Database | SQL vs NoSQL, Indexing, Transactions & ACID |
| API Design | REST principles, CORS, REST vs GraphQL |
| Performance | Core Web Vitals, Code splitting, Caching strategies |
| System Design | URL shortener, OAuth 2.0 flow |
| Git | merge vs rebase, interactive rebase |
| Security | XSS, CSRF, SQL Injection prevention |

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npx vercel --prod
```

## Adding More Questions

Edit `src/data/questions.ts` — add to the `questions` array:

```ts
{
  id: "js-009",            // unique ID
  category: "javascript",  // one of the 10 categories
  level: "intermediate",   // fresher | intermediate | advanced
  frequency: 4,            // 1-5, how often asked in interviews
  tags: ["closures", "scope"],
  question: "Your question here?",
  answer: "Detailed answer here...",
  codeExample: `// optional code example
const x = 1;`,
}
```

## Roadmap (future)

- [ ] Supabase auth + cloud sync (to share progress across devices)
- [ ] More topics: DSA, System Design, Behavioral, Next.js specific
- [ ] Spaced repetition algorithm (like Anki)
- [ ] Interview simulation mode (timed, random)
- [ ] Notes per question
- [ ] Export progress as PDF
- [ ] Multi-user (turn into a product)
# Prep_Forge
