import { Star, Filter } from "lucide-react";
import { motion } from "motion/react";

export default function FavoritesPage() {
  const favorites = [
    { id: 1, title: "Project Planning", preview: "Q1 goals and milestones for the upcoming quarter...", date: "2 hours ago", tags: ["work", "planning"], pinned: true },
    { id: 2, title: "Design System", preview: "Color palette, typography, and component library...", date: "Yesterday", tags: ["design", "ui"], pinned: true },
    { id: 3, title: "Meeting Notes", preview: "Weekly sync with design team about new features...", date: "3 days ago", tags: ["work", "meetings"], pinned: true },
    { id: 4, title: "Budget 2026", preview: "Annual budget planning and allocation...", date: "1 week ago", tags: ["finance"], pinned: false },
    { id: 5, title: "Book Notes", preview: "Summary and key takeaways from recent reads...", date: "2 weeks ago", tags: ["personal", "reading"], pinned: true },
    { id: 6, title: "Travel Plans", preview: "Upcoming trip itinerary and packing list...", date: "3 weeks ago", tags: ["personal", "travel"], pinned: false },
  ];

  return (
    <main className="gradient-background min-h-screen flex flex-col">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-border/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Favorites</h1>
          <button className="text-foreground hover:text-teal-500 transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 pt-20 px-4 pb-8 max-w-4xl mx-auto w-full">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-teal-500 fill-teal-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{favorites.length} Notes</p>
                <p className="text-xs text-muted-foreground">4 Pinned</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-medium">
                All
              </button>
              <button className="px-4 py-2 rounded-full bg-background/50 text-muted-foreground text-xs font-medium hover:bg-background/70 transition-colors">
                Pinned
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {favorites.map((note, index) => (
            <motion.button
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-5 rounded-2xl text-left hover:-translate-y-0.5 transition-all relative"
            >
              {note.pinned && (
                <div className="absolute top-4 right-4">
                  <Star className="h-4 w-4 text-teal-500 fill-teal-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2 pr-6">{note.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{note.preview}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {note.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-background/50 text-[10px] text-foreground/80">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{note.date}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
