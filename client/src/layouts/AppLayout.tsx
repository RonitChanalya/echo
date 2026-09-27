import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Orbit, Images, Plus } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/app"
            className="text-sm font-medium tracking-[0.3em] text-zinc-300"
          >
            ECHO
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/app/memories"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Images size={16} />
              Memories
            </Link>

            <Link
              to="/app/universe"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Orbit size={16} />
              Universe
            </Link>

            <Link
              to="/app/memories/new"
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              <Plus size={16} />
              Add Memory
            </Link>

            <button
              onClick={handleLogout}
              className="ml-2 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              aria-label="Logout"
            >
              <LogOut size={17} />
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-5">
        <div className="mb-5">
          <p className="text-sm text-zinc-500">
            Welcome back
          </p>

          <h1 className="mt-1 text-2xl font-light">
            {user?.name}
          </h1>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;