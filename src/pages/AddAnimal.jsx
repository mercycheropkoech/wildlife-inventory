import { useState } from "react";
import { db, storage, auth } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function AddAnimal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    species: "",
    location: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    console.log("Form data:", form);
    console.log("Auth user:", auth.currentUser);

    if (!form.name || !form.species || !form.location) {
      setStatus("Please fill in name, species, and location.");
      setLoading(false);
      return;
    }

    if (!auth.currentUser) {
      setStatus("❌ You must be logged in to add an animal. Please log in first.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = "";

      // Upload image if provided
      if (imageFile) {
        setStatus("Uploading image...");
        const imageRef = ref(storage, `animals/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded:", imageUrl);
      }

      setStatus("Saving animal data...");
      // Save animal data to Firestore
      const docRef = await addDoc(collection(db, "animals"), {
        name: form.name,
        species: form.species,
        location: form.location,
        description: form.description,
        imageUrl: imageUrl,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      console.log("Animal saved with ID:", docRef.id);
      setStatus("✓ Animal saved successfully!");
      setForm({ name: "", species: "", location: "", description: "" });
      setImageFile(null);
      setImagePreview("");

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Detailed error saving animal:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Add Animal</h1>
        <p className="mt-2 text-slate-600">Capture wildlife details, location, and photos in one elegant form.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name *</label>
            <input
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 disabled:opacity-50"
              placeholder="E.g. African Elephant"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Species *</label>
            <input
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 disabled:opacity-50"
              placeholder="E.g. Loxodonta africana"
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Location *</label>
            <input
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 disabled:opacity-50"
              placeholder="E.g. Serengeti National Park"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 disabled:opacity-50"
              placeholder="Add notes about the animal..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={loading}
              rows="4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Animal Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-2xl border border-slate-300" />
              </div>
            )}
          </div>

          {status && (
            <div className={`rounded-3xl px-4 py-3 text-sm shadow-sm ${
              status.includes("❌") 
                ? "bg-red-50 text-red-900 border border-red-200" 
                : "bg-cyan-50 text-cyan-900 border border-cyan-200"
            }`}>
              {status}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Animal"}
          </button>
        </form>
      </div>
    </div>
  );
}

