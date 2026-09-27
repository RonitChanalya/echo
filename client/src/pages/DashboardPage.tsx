import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Images,
  Orbit,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";

import { api } from "../services/api";
import type { Memory } from "../types/memory";

const DashboardPage = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await api("/memories");
        const data = await response.json();

        if (response.ok) {
          setMemories(data.memories);
        }
      } catch (error) {
        console.error(
          "Failed to fetch dashboard memories:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const recentMemories = memories.slice(0, 4);

  return (
    <section className="space-y-10">
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/app/memories/new"
          className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
            <Plus size={18} />
          </div>

          <h3 className="mt-5 text-sm font-medium text-zinc-100">
            Add a memory
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Add a new moment to your personal archive.
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500 transition group-hover:text-zinc-300">
            Create memory
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          to="/app/memories"
          className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
            <Images size={18} />
          </div>

          <h3 className="mt-5 text-sm font-medium text-zinc-100">
            Memories
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {loading
              ? "Loading archive..."
              : `${memories.length} ${
                  memories.length === 1
                    ? "memory"
                    : "memories"
                } saved`}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500 transition group-hover:text-zinc-300">
            Browse archive
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          to="/app/universe"
          className="group rounded-2xl border border-white/10 bg-black p-5 transition hover:border-white/20"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
            <Orbit size={18} />
          </div>

          <h3 className="mt-5 text-sm font-medium text-zinc-100">
            Universe
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Explore the hidden relationships between your memories.
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500 transition group-hover:text-zinc-300">
            Enter universe
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>
      </div>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Recent
            </p>

            <h3 className="mt-2 text-xl font-light text-zinc-100">
              Recent memories
            </h3>
          </div>

          {memories.length > 0 && (
            <Link
              to="/app/memories"
              className="text-sm text-zinc-500 transition hover:text-zinc-200"
            >
              View all
            </Link>
          )}
        </div>

        {!loading && memories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
            <p className="text-zinc-300">
              Nothing here yet.
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Add your first memory and ECHO will begin to take shape.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentMemories.map((memory, index) => (
              <motion.div
                key={memory._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <Link
                  to={`/app/memories/${memory._id}`}
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/20"
                >
                  {memory.media[0] && (
                    <img
                      src={memory.media[0].url}
                      alt={memory.title || "Memory"}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  )}

                  <div className="p-4">
                    <p className="truncate text-sm text-zinc-200">
                      {memory.title || "Untitled memory"}
                    </p>

                    {memory.location?.name && (
                      <p className="mt-1 truncate text-xs text-zinc-600">
                        {memory.location.name}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;