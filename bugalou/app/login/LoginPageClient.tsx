"use client"; // Zorg ervoor dat dit client-side is

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPageClient() {
  const router = useRouter();

  // Verkrijg de search parameters uit de URL
  const [callbackUrl, setCallbackUrl] = useState<string>("/app");  // Standaardwaarde

  useEffect(() => {
    // Controleer of we in de browser (client-side) zijn
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlCallback = searchParams.get("callbackUrl");
      if (urlCallback) {
        setCallbackUrl(urlCallback);  // Update de callbackUrl als deze aanwezig is
      }
    }
  }, []);  // Lege array zorgt ervoor dat dit alleen één keer wordt uitgevoerd

  // State voor formulier input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Functie voor login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError("Ongeldige inloggegevens");
      return;
    }

    // Succes -> redirect
    router.push(callbackUrl);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-sm w-full p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Inloggen</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-2">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm mb-2">Wachtwoord</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 p-3 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Inloggen..." : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
