import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  ImagePlus,
  MapPin,
  CalendarDays,
  ArrowRight,
  X,
} from "lucide-react";

import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { api } from "../services/api";

const CreateMemoryPage = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capturedAt, setCapturedAt] = useState("");
  const [locationName, setLocationName] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!image) {
      setError("Add an image before creating the memory.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("image", image);

      if (title.trim()) {
        formData.append("title", title.trim());
      }

      if (description.trim()) {
        formData.append(
          "description",
          description.trim()
        );
      }

      if (capturedAt) {
        formData.append("capturedAt", capturedAt);
      }

      if (locationName.trim()) {
        formData.append(
          "locationName",
          locationName.trim()
        );
      }

      const response = await api("/memories", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create memory"
        );
      }

      navigate("/app/memories");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
          New memory
        </p>

        <h2 className="mt-2 text-3xl font-light tracking-tight text-zinc-100">
          Add a piece of your life
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          This memory will eventually become part of your universe.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div>
          {!preview ? (
            <label className="group flex h-[390px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/25 hover:bg-white/[0.04]">
              <ImagePlus
                size={28}
                className="text-zinc-600 transition group-hover:text-zinc-400"
              />

              <p className="mt-4 text-sm text-zinc-400">
                Drop a piece of your life here
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                JPG, PNG, WEBP · up to 10 MB
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-[390px] overflow-hidden rounded-2xl border border-white/10 bg-black"
            >
              <img
                src={preview}
                alt="Memory preview"
                className="h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 p-2 text-zinc-300 backdrop-blur-md transition hover:bg-black hover:text-white"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500"
            >
              Title
            </label>

            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Pangong Lake"
              maxLength={120}
              className="w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/20"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500"
            >
              Story
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="What do you remember about this moment?"
              rows={4}
              maxLength={2000}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500"
              >
                <CalendarDays size={13} />
                Date
              </label>

              <input
                id="date"
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
                htmlFor="location"
                className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500"
              >
                <MapPin size={13} />
                Location
              </label>

              <input
                id="location"
                value={locationName}
                onChange={(e) =>
                  setLocationName(e.target.value)
                }
                placeholder="Pangong Lake, Ladakh"
                className="w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/20"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Saving memory..."
              : "Add to ECHO"}

            {!submitting && (
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateMemoryPage;