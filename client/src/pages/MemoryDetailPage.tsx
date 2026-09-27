import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { api } from "../services/api";
import type { Memory } from "../types/memory";

const MemoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capturedAt, setCapturedAt] = useState("");
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    const fetchMemory = async () => {
      if (!id) return;

      try {
        const response = await api(`/memories/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch memory"
          );
        }

        setMemory(data.memory);

        setTitle(data.memory.title || "");
        setDescription(data.memory.description || "");
        setCapturedAt(
          data.memory.capturedAt
            ? data.memory.capturedAt.slice(0, 10)
            : ""
        );
        setLocationName(
          data.memory.location?.name || ""
        );
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

    fetchMemory();
  }, [id]);

  const handleDelete = async () => {
    if (!memory) return;

    const confirmed = window.confirm(
      "Delete this memory? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await api(
        `/memories/${memory._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete memory"
        );
      }

      navigate("/app/memories");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleCancelEdit = () => {
    if (!memory) return;

    setTitle(memory.title || "");
    setDescription(memory.description || "");
    setCapturedAt(
      memory.capturedAt
        ? memory.capturedAt.slice(0, 10)
        : ""
    );
    setLocationName(memory.location?.name || "");

    setEditing(false);
  };

  const handleSave = async () => {
    if (!memory) return;

    try {
      setSaving(true);
      setError("");

      const response = await api(
        `/memories/${memory._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title,
            description,
            capturedAt,
            locationName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update memory"
        );
      }

      setMemory(data.memory);

      setTitle(data.memory.title || "");
      setDescription(data.memory.description || "");
      setCapturedAt(
        data.memory.capturedAt
          ? data.memory.capturedAt.slice(0, 10)
          : ""
      );
      setLocationName(
        data.memory.location?.name || ""
      );

      setEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update memory");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">
        Loading memory...
      </p>
    );
  }

  if (error && !memory) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!memory) {
    return null;
  }

  const image = memory.media[0];

  const displayDate = memory.capturedAt
    ? new Date(memory.capturedAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : null;

  return (
    <section className="mx-auto max-w-5xl pt-4">
      <button
        onClick={() => navigate("/app/memories")}
        className="mb-8 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
      >
        <ArrowLeft size={16} />
        Back to memories
      </button>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          {image && (
            <img
              src={image.url}
              alt={memory.title || "Memory"}
              className="w-full object-cover"
            />
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                Memory
              </p>

              {!editing ? (
                <h1 className="mt-2 text-3xl font-light tracking-tight text-zinc-100">
                  {memory.title || "Untitled memory"}
                </h1>
              ) : (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-2xl font-light text-zinc-100 outline-none transition focus:border-white/20"
                  placeholder="Memory title"
                />
              )}
            </div>

            <div className="flex gap-2">
              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="Edit memory"
                >
                  <Pencil size={16} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                    aria-label="Cancel editing"
                  >
                    <X size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                    aria-label="Save memory"
                  >
                    <Check size={16} />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                aria-label="Delete memory"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {!editing ? (
            <>
              <div className="mt-5 space-y-2 text-sm text-zinc-500">
                {displayDate && (
                  <div className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    {displayDate}
                  </div>
                )}

                {memory.location?.name && (
                  <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    {memory.location.name}
                  </div>
                )}
              </div>

              {memory.description && (
                <p className="mt-6 whitespace-pre-wrap leading-7 text-zinc-400">
                  {memory.description}
                </p>
              )}
            </>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="edit-description"
                  className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500"
                >
                  Story
                </label>

                <textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm leading-6 text-zinc-100 outline-none transition focus:border-white/20"
                  placeholder="What do you remember about this moment?"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-date"
                    className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500"
                  >
                    <CalendarDays size={13} />
                    Date
                  </label>

                  <input
                    id="edit-date"
                    type="date"
                    value={capturedAt}
                    onChange={(e) =>
                      setCapturedAt(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-zinc-300 outline-none transition focus:border-white/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-location"
                    className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500"
                  >
                    <MapPin size={13} />
                    Location
                  </label>

                  <input
                    id="edit-location"
                    value={locationName}
                    onChange={(e) =>
                      setLocationName(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-white/20"
                    placeholder="Location"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
              Intelligence
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              This memory has not been processed yet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoryDetailPage;