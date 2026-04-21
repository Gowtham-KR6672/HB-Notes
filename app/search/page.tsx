import { Search, Clock, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState([
    "Project planning",
    "Meeting notes",
    "Design system",
    "Budget 2026"
  ]);

  const [filteredNotes] = useState([
    { id: 1, title: "Project Planning", preview: "Q1 goals and milestones...", date: "2 hours ago", tags: ["work", "planning"] },
    { id: 2, title: "Meeting Notes", preview: "Weekly sync with design team...", date: "Yesterday", tags: ["work", "meetings"] },
    { id: 3, title: "Design System", preview: "Color palette and typography...", date: "3 days ago", tags: ["design", "ui"] },
  ]);

  return (
    <main className="gradient-background min-h-screen flex flex-col">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-border/10 px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">Search</h1>
      </div>

      <div className="flex-1 pt-20 px-4 pb-8 max-w-2xl mx-auto w-full">
        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full h-14 rounded-2xl bg-background/50 pl-12 pr-12 outline-none transition focus:ring-2 focus:ring-teal-500/50 border border-border/50 focus:border-teal-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Recent Searches */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground px-2">Recent</h2>
              <button className="text-xs text-teal-500 hover:text-teal-400 transition-colors">Clear all</button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{search}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-3 px-2">
              Results ({filteredNotes.length})
            </h2>
            <div className="space-y-3">
              {filteredNotes.map((note, index) => (
                <motion.button
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className="w-full glass-card p-4 rounded-2xl text-left hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{note.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{note.preview}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{note.date}</span>
                        {note.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-background/50">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
