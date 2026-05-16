import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener
    const unsubscribe = onSnapshot(collection(db, "animals"), (snapshot) => {
      try {
        setAnimals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error processing animals:", error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching animals:", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600">Loading animals...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.length > 0 ? (
            filteredAnimals.map((animal) => (
              <div
                key={animal.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                {animal.imageUrl && (
                  <img
                    src={animal.imageUrl}
                    alt={animal.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900">{animal.name || "Unnamed"}</h3>
                  <p className="text-sm text-cyan-600 font-semibold mt-1">{animal.species || "Unknown"}</p>
                  <p className="text-sm text-slate-600 mt-2">
                    <span className="font-semibold">Location:</span> {animal.location || "Not specified"}
                  </p>
                  {animal.description && (
                    <p className="text-sm text-slate-600 mt-2">
                      {animal.description.length > 100
                        ? `${animal.description.substring(0, 100)}...`
                        : animal.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600 col-span-full">
              No animals found. Try adding a new one or adjust your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
