import { WifiOff, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export default function OfflinePage() {
  return (
    <main className="gradient-background min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -25, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-12 w-64 h-48 glass-card rounded-3xl opacity-15"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-12 w-52 h-40 glass-card rounded-3xl opacity-12"
        />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-[2.5rem] p-8 md:p-10 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center"
          >
            <WifiOff className="h-10 w-10 text-rose-500" />
          </motion.div>

          {/* Content */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-3"
          >
            Offline Mode
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl font-bold text-foreground mb-4"
          >
            You're offline
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm leading-7 text-muted-foreground mb-8"
          >
            Cached notes remain available. As soon as you reconnect, edits and fresh note data can sync again.
          </motion.p>

          {/* Retry Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
