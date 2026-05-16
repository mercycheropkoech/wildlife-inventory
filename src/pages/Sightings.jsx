import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Sightings() {
  const [sightings, setSightings] = useState([]);
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [photo, setPhoto] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth();
  const fileRef = useRef(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem("sightings:v1");
    if (raw) setSightings(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("sightings:v1", JSON.stringify(sightings));
  }, [sightings]);

  function resetForm() {
    setSpecies("");
    setNotes("");
    setLocation("");
    setDate(new Date().toISOString().slice(0, 16));
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = null;
  }

  function addSighting(e) {
    e.preventDefault();
    if (!species.trim()) return alert("Please enter a species name.");
    const entry = {
      id: Date.now(),
      species: species.trim(),
      notes: notes.trim(),
      location: location.trim(),
      date: date || new Date().toISOString(),
      photo,
      favorite: false,
    };
    setSightings((s) => [entry, ...s]);
    resetForm();
  }

  function handlePhoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return setPhoto(null);
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function tryGeolocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported in this browser.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setLocation(coords);
      },
      () => alert("Unable to retrieve location")
    );
  }

  function removeSighting(id) {
    if (!confirm("Delete this sighting?")) return;
    // delete locally
    setSightings((s) => s.filter((x) => x.id !== id));
    // delete in Firestore if synced
    if (syncEnabled && user) {
      const item = sightings.find((it) => it.id === id);
      if (item && item.docId) {
        deleteDoc(doc(db, "sightings", item.docId)).catch((e) => console.warn(e));
      }
    }
  }

  function toggleFavorite(id) {
    setSightings((s) => {
      const next = s.map((it) => (it.id === id ? { ...it, favorite: !it.favorite } : it));
      if (syncEnabled && user) {
        const item = next.find((it) => it.id === id);
        if (item && item.docId) {
          updateDoc(doc(db, "sightings", item.docId), { favorite: item.favorite }).catch((e) => console.warn(e));
        }
      }
      return next;
    });
  }

  const filtered = sightings.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.species.toLowerCase().includes(q) ||
      s.notes.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  });

  function sorted(list) {
    const arr = [...list];
    if (sort === "date_desc") return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "date_asc") return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "species_az") return arr.sort((a, b) => a.species.localeCompare(b.species));
    return arr;
  }

  // CSV export/import
  function exportCSV(items = filtered) {
    const headers = ["species", "notes", "location", "date", "favorite"];
    const rows = items.map((it) => [it.species, it.notes, it.location, it.date, it.favorite ? "1" : "0"]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sightings.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importCSV(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return alert("CSV appears empty");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const items = lines.slice(1).map((ln) => {
        const cols = ln.split(",").map((c) => c.replace(/^"|"$/g, ""));
        const obj = {};
        headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
        return {
          id: Date.now() + Math.random(),
          species: obj.species || "",
          notes: obj.notes || "",
          location: obj.location || "",
          date: obj.date || new Date().toISOString(),
          favorite: obj.favorite === "1" || obj.favorite === "true",
        };
      });
      setSightings((s) => [...items, ...s]);
    };
    reader.readAsText(file);
  }

  // Firestore sync
  useEffect(() => {
    if (!syncEnabled || !user) return;
    setSyncing(true);
    const q = query(collection(db, "sightings"), where("userId", "==", user.uid), orderBy("date", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
        // convert Firestore timestamps if needed
        setSightings(docs.map((d) => ({ ...d, id: d.localId || d.docId })));
        setSyncing(false);
      },
      (err) => {
        console.error("Sightings sync error", err);
        setSyncing(false);
      }
    );
    unsubRef.current = unsub;
    return () => unsub && unsub();
  }, [syncEnabled, user]);

  async function pushLocalToFirestore() {
    if (!user) return alert("Sign in to sync with Firestore.");
    for (const it of sightings) {
      try {
        await addDoc(collection(db, "sightings"), { ...it, userId: user.uid, localId: it.id });
      } catch (e) {
        console.warn("Failed to push item", e);
      }
    }
    alert("Push complete (best-effort).");
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sightings</h1>
            <p className="mt-2 text-slate-600">Log and review wildlife observations with quick context and photos.</p>
          </div>
          <div className="w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search species, notes, location"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <form onSubmit={addSighting} className="mt-6 grid gap-4 sm:grid-cols-3">
          <input
            className="col-span-1 rounded-md border px-3 py-2"
            placeholder="Species (required)"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />

          <input
            className="col-span-1 rounded-md border px-3 py-2"
            placeholder="Location (lat, lon)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="datetime-local"
            className="col-span-1 rounded-md border px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <textarea
            className="sm:col-span-2 rounded-md border px-3 py-2"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} />
            <button type="button" onClick={tryGeolocation} className="rounded bg-sky-600 px-3 py-1 text-white">
              Use GPS
            </button>
            <button type="submit" className="ml-auto rounded bg-green-600 px-4 py-2 text-white">
              Add
            </button>
          </div>
          {photo && (
            <div className="rounded border p-2">
              <img src={photo} alt="preview" className="h-28 w-auto object-cover" />
            </div>
          )}
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">Recent Sightings</h2>
          {filtered.length === 0 ? (
            <p className="mt-2 text-slate-600">No sightings yet — add one above.</p>
          ) : (
            <div className="mt-4">
              <div className="mb-3 flex items-center gap-3">
                <label className="text-sm text-slate-600">Sort:</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded border px-2 py-1">
                  <option value="date_desc">Date (newest)</option>
                  <option value="date_asc">Date (oldest)</option>
                  <option value="species_az">Species (A-Z)</option>
                </select>

                <button onClick={() => exportCSV()} className="rounded bg-slate-100 px-3 py-1 text-sm">Export CSV</button>
                <label className="rounded bg-slate-100 px-3 py-1 text-sm cursor-pointer">
                  Import CSV
                  <input type="file" accept="text/csv" onChange={importCSV} className="hidden" />
                </label>

                <label className="ml-auto flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={syncEnabled} onChange={(e) => setSyncEnabled(e.target.checked)} />
                  Sync with Firestore
                </label>
                {syncEnabled && (
                  <button onClick={pushLocalToFirestore} className="rounded bg-sky-600 px-3 py-1 text-white text-sm">
                    Push local
                  </button>
                )}
                {syncing && <div className="text-sm text-slate-500">Syncing…</div>}

              </div>

              <ul className="space-y-4">
              {sorted(filtered).map((s) => (
                <li key={s.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="w-24">
                    {s.photo ? (
                      <img src={s.photo} alt="sighting" className="h-20 w-20 rounded object-cover" />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded bg-slate-50 text-sm text-slate-400">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">{s.species}</div>
                        <div className="text-sm text-slate-500">{new Date(s.date).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleFavorite(s.id)} className="text-yellow-500">
                          {s.favorite ? "★" : "☆"}
                        </button>
                        <button onClick={() => removeSighting(s.id)} className="text-red-500">
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-slate-700">{s.notes}</div>
                    {s.location && (
                      <div className="mt-2 text-sm text-slate-500">
                        Location: {s.location} — <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.location)}`} target="_blank" rel="noreferrer" className="text-sky-600">Open map</a>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              </ul>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
