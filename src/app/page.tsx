"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Level, Question } from "@/types";
import { questions, categories } from "@/data/questions";
import { useProgress } from "@/hooks/useProgress";
import { StatsBar } from "@/components/StatsBar";
import { CategoryNav } from "@/components/CategoryNav";
import { FilterBar } from "@/components/FilterBar";
import { QuestionCard } from "@/components/QuestionCard";
import { QuizMode } from "@/components/QuizMode";
import { Code2, Zap, Menu, X, Shuffle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | "all" | "bookmarked">("all");
  const [level, setLevel] = useState<Level | "all">("all");
  const [sortBy, setSortBy] = useState<"frequency" | "level" | "status">("frequency");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizMode, setQuizMode] = useState(false);

  const { stats, updateStatus, toggleBookmark, getStatus, isBookmarked, progress, loaded } = useProgress();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: questions.length, bookmarked: 0 };
    categories.forEach((cat) => { counts[cat.id] = questions.filter((q) => q.category === cat.id).length; });
    counts.bookmarked = Object.values(progress).filter((p) => p.bookmarked).length;
    return counts;
  }, [progress]);

  const filtered = useMemo(() => {
    let list: Question[] = [...questions];
    if (activeCategory === "bookmarked") { list = list.filter((q) => isBookmarked(q.id)); }
    else if (activeCategory !== "all") { list = list.filter((q) => q.category === activeCategory); }
    if (level !== "all") { list = list.filter((q) => q.level === level); }
    if (search.trim()) {
      const sq = search.toLowerCase();
      list = list.filter((item) => item.question.toLowerCase().includes(sq) || item.answer.toLowerCase().includes(sq) || item.tags.some((t) => t.toLowerCase().includes(sq)));
    }
    const levelOrder = { fresher: 0, intermediate: 1, advanced: 2 };
    const statusOrder = { unseen: 0, reviewing: 1, known: 2 };
    list.sort((a, b) => {
      if (sortBy === "frequency") return b.frequency - a.frequency;
      if (sortBy === "level") return levelOrder[a.level] - levelOrder[b.level];
      if (sortBy === "status") return statusOrder[getStatus(a.id)] - statusOrder[getStatus(b.id)];
      return 0;
    });
    return list;
  }, [activeCategory, level, search, sortBy, isBookmarked, getStatus]);

  const unseenCount = filtered.filter((q) => getStatus(q.id) === "unseen").length;

  return (
    <>
      <AnimatePresence>
        {quizMode && (
          <QuizMode questions={filtered} onStatusChange={updateStatus} onClose={() => setQuizMode(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col">
        <header className="border-b border-[var(--border)] bg-[var(--bg-1)]/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                <Zap size={14} className="text-black" />
              </div>
              <span className="font-semibold text-sm tracking-tight">PrepForge</span>
              <span className="hidden sm:inline text-xs text-zinc-600 ml-1">· Fullstack Interview Prep</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
                <Code2 size={13} />
                <span className="tabular-nums">{stats.known}/{stats.total} mastered</span>
              </div>
              <button
                onClick={() => filtered.length > 0 && setQuizMode(true)}
                disabled={filtered.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent-dim)] hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs text-green-400 font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Shuffle size={12} />
                <span className="hidden sm:inline">Quiz mode</span>
                <span className="sm:hidden">Quiz</span>
              </button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden p-2 hover:bg-white/5 rounded-lg transition-colors">
                {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">
          <aside className={cn("w-52 flex-shrink-0 space-y-5 hidden sm:block", sidebarOpen && "fixed sm:static inset-0 z-30 bg-[var(--bg-0)] sm:bg-transparent pt-16 sm:pt-0 px-4 sm:px-0 overflow-y-auto sm:overflow-visible block")}>
            {loaded && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider px-1">Progress</p>
                <StatsBar stats={stats} />
              </div>
            )}
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider px-1">Topics</p>
              <CategoryNav active={activeCategory} onChange={(cat) => { setActiveCategory(cat); setSidebarOpen(false); }} counts={categoryCounts} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider px-1">Quick start</p>
              <button onClick={() => { setLevel("fresher"); setActiveCategory("all"); setSortBy("frequency"); }} className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors flex items-center gap-2">
                <span className="text-blue-400">●</span> Fresher essentials
              </button>
              <button onClick={() => { setLevel("intermediate"); setActiveCategory("all"); setSortBy("frequency"); }} className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors flex items-center gap-2">
                <span className="text-yellow-400">●</span> Intermediate set
              </button>
              <button onClick={() => setActiveCategory("bookmarked")} className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors flex items-center gap-2">
                <span>🔖</span> My bookmarks
              </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0 space-y-4">
            <FilterBar level={level} onLevelChange={setLevel} sortBy={sortBy} onSortChange={setSortBy} total={questions.length} showing={filtered.length} search={search} onSearch={setSearch} />

            {loaded && unseenCount > 0 && !search && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between px-4 py-3 bg-[var(--accent-dim)] border border-green-500/15 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400"><strong className="font-semibold">{unseenCount}</strong> unseen questions ready</span>
                </div>
                <button onClick={() => setQuizMode(true)} className="text-xs text-green-400 hover:text-green-300 font-medium flex items-center gap-1 transition-colors">
                  Start quiz <Shuffle size={11} />
                </button>
              </motion.div>
            )}

            {loaded && unseenCount === 0 && filtered.length > 0 && !search && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 border border-white/8 rounded-xl">
                <span className="text-xs text-zinc-500">All questions reviewed in this view 🎉</span>
                <button onClick={() => filtered.forEach((q) => { if (getStatus(q.id) !== "known") updateStatus(q.id, "unseen"); })} className="text-xs text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition-colors">
                  <RotateCcw size={11} /> Reset reviewing
                </button>
              </motion.div>
            )}

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-zinc-600 text-sm">
                    {search ? `No questions matching "${search}"` : "No questions in this category yet"}
                  </motion.div>
                ) : (
                  filtered.map((q, i) => (
                    <QuestionCard key={q.id} question={q} status={getStatus(q.id)} bookmarked={isBookmarked(q.id)} onStatusChange={updateStatus} onBookmark={toggleBookmark} index={i} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {filtered.length > 0 && (
              <p className="text-center text-xs text-zinc-700 py-4">
                {filtered.length} question{filtered.length !== 1 ? "s" : ""} · Click any card to reveal the answer · Green = mastered
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
