"use client";

import { useState } from "react";


export default function UnlockPage() {
  const [password, setPassword] = useState("");

  const handleUnlock = (e: React.SyntheticEvent) => {
    e.preventDefault();
    document.cookie = `site-unlocked=${password}; path=/; SameSite=Lax`;
    window.location.href = "/";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Private Project
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          This site is currently under development. Enter the password to
          continue.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Unlock
          </button>
        </form>
      </div>
    </main>
  );
}