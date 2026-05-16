import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      const snapshot = await getDocs(collection(db, "animals"));
      setAnimals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchAnimals();
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const query = search.toLowerCase();
      return (
        animal.name?.toLowerCase().includes(query) ||
        animal.species?.toLowerCase().includes(query) ||
        animal.location?.toLowerCase().includes(query)
      );
    });
  }, [animals, search]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Animals</h1>
          <p className="mt-2 text-slate-600">Browse all wildlife records with location details.</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, species, or location"
          className="w-full max-w-md rounded-3xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-cyan-500 outline-none"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map((animal) => (
            <div key={animal.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-600">{animal.species || "Unknown"}</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900">{animal.name || "Unnamed"}</h2>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700">🐾</span>
              </div>
              <p className="text-slate-600">Location</p>
              <p className="mt-2 text-slate-900 text-lg font-medium">{animal.location || "Not specified"}</p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600">
            No animals found. Try adding a new one or adjust your search.
          </div>
        )}
      </div>
    </div>
  );
}
