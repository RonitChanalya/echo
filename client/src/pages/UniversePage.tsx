import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  User,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "motion/react";

import MemoryFlowBackground from "../components/visuals/MemoryFlowBackground";

const UniversePage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <MemoryFlowBackground />

      <div className="absolute inset-0 bg-black/30" />

      {/* top-left */}
      <Link
        to="/app"
        className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-400 backdrop-blur-xl transition hover:bg-white/[0.06] hover:text-white"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </Link>

      {/* top-right */}
      <button
        type="button"
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-400 backdrop-blur-xl transition hover:bg-white/[0.06] hover:text-white"
        aria-label="Profile"
      >
        <User size={18} />
      </button>

      {/* bottom-left */}
      <button
        type="button"
        className="absolute bottom-5 left-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-400 backdrop-blur-xl transition hover:bg-white/[0.06] hover:text-white"
        aria-label="Universe controls"
      >
        <SlidersHorizontal size={18} />
      </button>

      {/* bottom-right */}
      <Link
        to="/app/memories/new"
        className="absolute bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white text-black transition hover:bg-zinc-200"
        aria-label="Add memory"
      >
        <Plus size={18} />
      </Link>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-600">
            Your universe
          </p>

          <h1 className="mt-3 text-4xl font-light tracking-tight text-white">
            Your universe is still forming
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
            As ECHO understands your memories, their hidden connections will
            begin appearing here.
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default UniversePage;