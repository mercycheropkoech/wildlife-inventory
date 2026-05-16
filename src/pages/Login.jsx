import { useState } from "react";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      if (!auth || !provider) {
        setError(
          "Firebase is not configured correctly. Please check your .env.local file and restart the dev server."
        );
        return;
      }

      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const message = err?.message || "Google sign-in failed.";

      if (err?.code === "auth/popup-blocked" || err?.code === "auth/cancelled-popup-request") {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          console.error("Redirect fallback failed:", redirectError);
          setError(
            `Popup blocked. Redirect fallback failed: ${redirectError?.message || redirectError}.`
          );
          return;
        }
      }

      setError(
        `Google sign-in failed: ${message}. Make sure popups are enabled and the Firebase OAuth redirect is configured.`
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 shadow-lg rounded-xl bg-white">
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}