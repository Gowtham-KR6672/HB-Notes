"use client";

import Link from "next/link";
import { ArrowRight, Zap, Share2, Paperclip } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <main className="gradient-background min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Notes Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-64 h-40 glass-card rounded-2xl opacity-30"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-10 w-48 h-32 glass-card rounded-2xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-40 h-28 glass-card rounded-2xl opacity-25"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Capture Your Thoughts
            <span className="block bg-gradient-to-r from-teal-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A premium note-taking experience with glassmorphism design, seamless sync, and powerful collaboration tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel text-foreground font-semibold hover:bg-white/10 transition-all"
              >
                Login
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-6 rounded-2xl text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-teal-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Notes</h3>
            <p className="text-sm text-muted-foreground">Instant capture with markdown support and real-time sync.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-card p-6 rounded-2xl text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
              <Share2 className="h-6 w-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
            <p className="text-sm text-muted-foreground">Share notes with one click and collaborate in real-time.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-6 rounded-2xl text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <Paperclip className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Attachments</h3>
            <p className="text-sm text-muted-foreground">Attach files, images, and documents to your notes.</p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
