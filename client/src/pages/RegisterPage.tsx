import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

import { useAuth } from "../context/AuthContext";
import MemoryFlowBackground from "../components/visuals/MemoryFlowBackground";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await register(name, username, email, password);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <MemoryFlowBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-block text-sm font-medium tracking-[0.32em] text-zinc-400 transition hover:text-white"
            >
              ECHO
            </Link>

            <h1 className="mt-5 text-3xl font-light tracking-tight text-white">
              Create your universe
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Every universe begins with a first memory.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-zinc-500"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.05]"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-zinc-500"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ronit"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.05]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-zinc-500"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.05]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-zinc-500"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-11 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.05]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create ECHO"}

                {!submitting && (
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have a universe?{" "}
            <Link
              to="/login"
              className="text-zinc-300 transition hover:text-white"
            >
              Enter ECHO
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default RegisterPage;