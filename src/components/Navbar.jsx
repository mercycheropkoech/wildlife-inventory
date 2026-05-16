import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-lg">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 max-w-7xl">
        <Link to="/dashboard" className="flex items-center gap-3 text-lg font-semibold">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white shadow-md">
            🐘
          </span>
          <span>Wildlife Management</span>
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard" className="hover:text-cyan-300 transition">
            Dashboard
          </Link>
          <Link to="/animals" className="hover:text-cyan-300 transition">
            Animals
          </Link>
          <Link to="/add-animal" className="hover:text-cyan-300 transition">
            Add Animal
          </Link>
          <Link to="/sightings" className="hover:text-cyan-300 transition">
            Sightings
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              to="/login"
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-cyan-400 transition"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold shadow hover:bg-rose-400 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
