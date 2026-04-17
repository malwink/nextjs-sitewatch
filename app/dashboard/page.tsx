"use client";

import { useEffect, useState } from "react";

type Check = {
  id: string;
  url: string;
  status: number | null;
  ok: boolean;
  latencyMs: number;
  checkedAt: string;
  error?: string;
};

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchChecks() {
    const res = await fetch("/api/checks");
    const data = await res.json().catch(() => []);
    setChecks(data || []);
  }

  useEffect(() => {
    fetchChecks();
  }, []);

  async function runCheck(e?: React.FormEvent) {
    e?.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setChecks((c) => [data, ...c].slice(0, 50));
      setUrl("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">SiteWatch — Dashboard</h1>

      <form onSubmit={runCheck} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button
          className="rounded-md bg-black px-4 py-2 text-white"
          disabled={loading}
        >
          {loading ? "Checking…" : "Run Check"}
        </button>
      </form>

      <section>
        <h2 className="mb-2 text-lg font-medium">Recent Checks</h2>
        <div className="space-y-2">
          {checks.length === 0 ? (
            <div className="text-sm text-gray-600">No checks yet.</div>
          ) : (
            checks.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div>
                  <div className="font-medium">{c.url}</div>
                  <div className="text-xs text-gray-600">{c.checkedAt}</div>
                </div>
                <div className="text-right">
                  {c.error ? (
                    <div className="text-sm text-red-600">Error</div>
                  ) : (
                    <div className="text-sm">{c.status}</div>
                  )}
                  <div className="text-xs text-gray-500">{c.latencyMs}ms</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
