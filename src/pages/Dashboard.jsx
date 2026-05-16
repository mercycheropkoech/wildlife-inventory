import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ animals: 0 });
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener
    const unsubscribe = onSnapshot(collection(db, "animals"), (snapshot) => {
      try {
        const animalsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnimals(animalsList);
        setStats({ animals: animalsList.length });
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this animal record?")) {
      try {
        await deleteDoc(doc(db, "animals", id));
        setAnimals(animals.filter((animal) => animal.id !== id));
        setStats({ animals: stats.animals - 1 });
      } catch (error) {
        console.error("Error deleting animal:", error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 rounded-3xl bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome{user?.displayName ? `, ${user.displayName}` : user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="mt-2 text-slate-600">
          A modern wildlife management dashboard for tracking animals, sightings, and locations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
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

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Animals Library</h2>
          <button
            onClick={() => navigate("/add-animal")}
            className="rounded-full bg-cyan-600 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition"
          >
            + Add Animal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600">Loading animals...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600 mb-4">No animals recorded yet.</p>
          <button
            onClick={() => navigate("/add-animal")}
            className="rounded-full bg-cyan-600 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition"
          >
            Add First Animal
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {animals.map((animal) => (
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
                <h3 className="text-lg font-bold text-slate-900">{animal.name}</h3>
                <p className="text-sm text-cyan-600 font-semibold mt-1">{animal.species}</p>
                <p className="text-sm text-slate-600 mt-2">
                  <span className="font-semibold">Location:</span> {animal.location}
                </p>
                {animal.description && (
                  <p className="text-sm text-slate-600 mt-2">
                    {animal.description.length > 100
                      ? `${animal.description.substring(0, 100)}...`
                      : animal.description}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate("/animals")}
                    className="flex-1 rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-600 hover:bg-cyan-100 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(animal.id)}
                    className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
