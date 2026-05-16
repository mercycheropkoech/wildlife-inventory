import { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function AddAnimal() {
  const [form, setForm] = useState({
    name: "",
    species: "",
    location: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!form.name || !form.species || !form.location) {
      setStatus("Please fill in all fields before saving.");
      return;
    }

    await addDoc(collection(db, "animals"), form);
    setStatus("Animal saved successfully.");
    setForm({ name: "", species: "", location: "" });
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Add Animal</h1>
        <p className="mt-2 text-slate-600">Capture wildlife details and location in one elegant form.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
            <input
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
              placeholder="E.g. African Elephant"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Species</label>
            <input
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
              placeholder="E.g. Loxodonta africana"
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
            <input
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
              placeholder="E.g. Serengeti National Park"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {status && (
            <div className="rounded-3xl bg-cyan-50 px-4 py-3 text-sm text-cyan-900 shadow-sm">
              {status}
            </div>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition"
          >
            Save Animal
          </button>
        </form>
      </div>
    </div>
  );
}
