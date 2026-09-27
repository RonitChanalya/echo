import { useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { api } from "../services/api";
import type { Memory } from "../types/memory";

const MemoriesPage = () => {
  const navigate = useNavigate();

  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await api("/memories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch memories"
          );
        }

        setMemories(data.memories);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const handleDelete = async (
    e: React.MouseEvent,
    memoryId: string
  ) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Delete this memory? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(memoryId);

      const response = await api(`/memories/${memoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete memory"
        );
      }

      setMemories((current) =>
        current.filter(
          (memory) => memory._id !== memoryId
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete memory");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">
        Loading memories...
      </p>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
          Archive
        </p>

        <h2 className="mt-2 text-3xl font-light tracking-tight text-zinc-100">
          Your memories
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          {memories.length}{" "}
          {memories.length === 1 ? "memory" : "memories"}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {memories.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
          <p className="text-zinc-300">
            Your archive is empty.
          </p>

          <p className="mt-2 text-sm text-zinc-600">
            Add your first memory to begin shaping your universe.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {memories.map((memory, index) => {
            const image = memory.media[0];

            const date = memory.capturedAt
              ? new Date(memory.capturedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              : null;

            const isDeleting =
              deletingId === memory._id;

            return (
              <motion.article
                key={memory._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                }}
                whileHover={{ y: -4 }}
                onClick={() =>
                  navigate(
                    `/app/memories/${memory._id}`
                  )
                }
                className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition hover:border-white/20"
              >
                <div className="relative overflow-hidden">
                  {image && (
                    <img
                      src={image.url}
                      alt={memory.title || "Memory"}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  <button
                    type="button"
                    onClick={(e) =>
                      handleDelete(e, memory._id)
                    }
                    disabled={isDeleting}
                    className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/55 p-2 text-zinc-400 opacity-0 backdrop-blur-md transition hover:bg-black hover:text-red-300 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Delete memory"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-medium text-zinc-100">
                    {memory.title ||
                      "Untitled memory"}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    {date && <span>{date}</span>}

                    {memory.location?.name && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {memory.location.name}
                      </span>
                    )}
                  </div>

                  {memory.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                      {memory.description}
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MemoriesPage;