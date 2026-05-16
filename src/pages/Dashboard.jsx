import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ animals: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const snapshot = await getDocs(collection(db, "animals"));
      setStats({ animals: snapshot.size });
    };

    fetchStats();
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 rounded-3xl bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-slate-900">Welcome{user?.displayName ? `, ${user.displayName}` : ""}</h1>
        <p className="mt-2 text-slate-600">A modern wildlife management dashboard for tracking animals, sightings, and locations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Animals</p>
          <p className="mt-4 text-5xl font-semibold text-slate-900">{stats.animals}</p>
          <p className="mt-3 text-slate-600">Total animal records in the system.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Location</p>
          <p className="mt-4 text-5xl font-semibold text-slate-900">Geo-aware</p>
          <p className="mt-3 text-slate-600">Every animal entry includes location details.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Experience</p>
          <p className="mt-4 text-5xl font-semibold text-slate-900">Interactive</p>
          <p className="mt-3 text-slate-600">Browse, search, and manage wildlife data easily.</p>
        </div>
      </div>
    </div>
  );
}
