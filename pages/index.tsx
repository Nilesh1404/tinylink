// pages/index.tsx
import { useEffect, useMemo, useState } from "react";

interface LinkItem {
  code: string;
  url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
}

const PAGE_SIZE = 8;

function Toast({ text, onClose }: { text: string; onClose?: () => void }) {
  useEffect(() => {
    if (!text) return;
    const t = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(t);
  }, [text, onClose]);
  if (!text) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 backdrop-blur-md bg-white/60 border border-white/40 text-gray-900 px-4 py-2 rounded-xl shadow-lg">
      {text}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Fetch links
  useEffect(() => {
    let mounted = true;
    fetch("/api/links")
      .then((r) => r.json())
      .then((data: LinkItem[]) => {
        if (!mounted) return;
        setLinks(data);
      })
      .catch(() => setError("Failed to load links"));
    return () => {
      mounted = false;
    };
  }, [refreshFlag]);

  const filtered = useMemo(() => {
    if (!query) return links;
    const q = query.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
    );
  }, [links, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const topLinks = useMemo(
    () => [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 6),
    [links]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(`Created: ${data.code}`);
        setUrl("");
        setCode("");
        setRefreshFlag((f) => f + 1);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deleteCode: string) => {
    if (!confirm(`Delete ${deleteCode}?`)) return;

    try {
      const res = await fetch(`/api/links/${deleteCode}`, {
        method: "DELETE",
      });

        if (res.status === 204) {
        setSuccess("Deleted");
        setRefreshFlag((f) => f + 1);
      } else {
        const d = await res.json();
        setError(d?.error || "Delete failed");
      }
    } catch {
      setError("Network error");
    }
  };

  const handleCopy = (c: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${c}`);
    setSuccess("Copied to clipboard");
  };

  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="max-w-6xl mx-auto">

        {/* Header — White Glass */}
        <header className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 mb-10">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
                TinyLink
              </h1>
              <p className="text-white/80 mt-2 text-lg">
                Create clean short URLs with a premium, futuristic UI.
              </p>
            </div>

            <a
              href="/healthz"
              target="_blank"
              className="px-5 py-2.5 bg-white/30 text-white rounded-2xl border border-white/40 shadow hover:bg-white/40 backdrop-blur-lg transition"
            >
              Health
            </a>
          </div>
        </header>

        {/* Main layout */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT CONTENT: White Glass */}
          <section className="md:col-span-2 space-y-8">

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Create Short Link
              </h2>

              <div className="space-y-4">
                {/* Long URL */}
                <div>
                  <label className="block text-white/80 text-sm mb-1">
                    Long URL
                  </label>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/some-path"
                    className="w-full p-3 rounded-xl bg-white/70 border border-white/40 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-900 text-sm"
                    required
                  />
                </div>

                {/* Custom code */}
                <div>
                  <label className="block text-white/80 text-sm mb-1">
                    Custom Code (optional)
                  </label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="offer2025"
                    className="w-full p-3 rounded-xl bg-white/70 border border-white/40 focus:ring-2 focus:ring-blue-300 text-gray-900 text-sm"
                  />
                </div>

                {/* Buttons */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Generate Short Link"}
                </button>

                {error && <p className="text-red-300 text-sm">{error}</p>}
                {success && <p className="text-green-200 text-sm">{success}</p>}
              </div>
            </form>

            {/* Link Table */}
            <div className="backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Your Links
                </h3>
                <input
                  placeholder="Search…"
                  className="px-3 py-2 rounded-xl bg-white/70 text-gray-900 border border-white/40 text-sm"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {filtered.length === 0 ? (
                <p className="text-white/60 text-sm">No links yet.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-white/90">
                      <thead className="text-xs text-white/60 uppercase border-b border-white/20">
                        <tr>
                          <th className="py-3">Code</th>
                          <th className="py-3">URL</th>
                          <th className="py-3">Clicks</th>
                          <th className="py-3">Last Clicked</th>
                          <th className="py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageItems.map((l) => (
                          <tr
                            key={l.code}
                            className="border-b border-white/10 hover:bg-white/10 transition"
                          >
                            <td className="py-3">
                              <a className="text-blue-300" href={`/code/${l.code}`}>
                                {l.code}
                              </a>
                            </td>
                            <td className="py-3 max-w-xs truncate text-white/80">
                              {l.url}
                            </td>
                            <td className="py-3 text-white/90">{l.clicks}</td>
                            <td className="py-3 text-white/80">
                              {l.last_clicked
                                ? new Date(l.last_clicked).toLocaleString()
                                : "Never"}
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCopy(l.code)}
                                  className="px-3 py-1 bg-blue-600/80 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                  Copy
                                </button>
                                <a
                                  href={`/${l.code}`}
                                  target="_blank"
                                  className="px-3 py-1 bg-green-600/80 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                  Open
                                </a>
                                <button
                                  onClick={() => handleDelete(l.code)}
                                  className="px-3 py-1 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center text-white/80 text-sm mt-4">
                    <span>
                      Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                      {" "}of {filtered.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 disabled:opacity-40 hover:bg-white/30"
                      >
                        Prev
                      </button>
                      <div className="px-3 py-1 rounded-lg bg-white/10 border border-white/20">
                        Page {page}/{totalPages}
                      </div>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 disabled:opacity-40 hover:bg-white/30"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* RIGHT SIDEBAR — DARK GLASS */}
          <aside className="space-y-8">

            {/* Top Links chart */}
            <div className="backdrop-blur-xl bg-black/30 border border-white/20 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Top Links</h3>

              {topLinks.length === 0 ? (
                <p className="text-white/70 text-sm">No analytics yet.</p>
              ) : (
                <div className="space-y-4">
                  {topLinks.map((t) => {
                    const max = Math.max(...topLinks.map((x) => x.clicks), 1);
                    const pct = (t.clicks / max) * 100;
                    return (
                      <div key={t.code}>
                        <div className="flex justify-between mb-1">
                          <span className="text-white/90">{t.code}</span>
                          <span className="text-white/70 text-sm">{t.clicks}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-blue-400 rounded-full h-2"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-black/30 border border-white/20 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setUrl("");
                    setCode("");
                  }}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30"
                >
                  Clear Form
                </button>

                <button
                  onClick={() => setRefreshFlag((f) => f + 1)}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30"
                >
                  Refresh Data
                </button>

                <a
                  href="/api/links"
                  target="_blank"
                  className="px-4 py-2 rounded-xl text-center bg-white/20 hover:bg-white/30 border border-white/30"
                >
                  Open /api/links
                </a>
              </div>
            </div>
          </aside>
        </main>
      </div>

      <Toast
        text={error || success}
        onClose={() => {
          setError("");
          setSuccess("");
        }}
      />
    </div>
  );
}
