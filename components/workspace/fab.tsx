"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";

type FloatingActionButtonProps = {
  onClick: () => void;
};

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ 
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 right-5 z-40 h-16 w-16 rounded-full bg-foreground text-background shadow-xl transition-all xl:hidden border-4 border-background flex items-center justify-center"
    >
      <motion.div>
        <Plus className="h-8 w-8 text-background transition-transform" />
      </motion.div>
    </motion.button>
  );
}
