// pages/links.tsx
import { useEffect, useState, useMemo } from "react";

interface LinkItem {
  code: string;
  url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/links")
      .then((r) => r.json())
      .then((data) => setLinks(data))
      .catch(() => setError("Failed to load links"));
  }, []);

  const filtered = useMemo(() => {
    if (!query) return links;
    const q = query.toLowerCase();
    return links.filter(
      (l) => l.code.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
    );
  }, [links, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete ${code}?`)) return;

    const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
    if (res.status === 204) {
      setLinks((prev) => prev.filter((l) => l.code !== code));
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                All Links
              </h1>
              <p className="text-white/80 mt-2">
                Manage all your TinyLink URLs
              </p>
            </div>

            <a
              href="/"
              className="px-5 py-2.5 bg-white/30 text-white rounded-2xl border border-white/40 shadow hover:bg-white/40 transition"
            >
              Home
            </a>
          </div>
        </header>

        {/* Glass Table */}
        <div className="backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl shadow-xl p-6 text-white">
          {/* Search */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Links</h2>
            <input
              placeholder="Search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-white/70 text-gray-900 border border-white/40 text-sm"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-white/70">No links found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white/90">
                  <thead className="text-xs text-white/60 uppercase border-b border-white/20">
                    <tr>
                      <th className="py-3">Code</th>
                      <th className="py-3">URL</th>
                      <th className="py-3">Clicks</th>
                      <th className="py-3">Last Click</th>
                      <th className="py-3">Created</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageItems.map((l) => (
                      <tr
                        key={l.code}
                        className="border-b border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="py-3 text-blue-300">{l.code}</td>
                        <td className="py-3 max-w-xs truncate">{l.url}</td>
                        <td className="py-3">{l.clicks}</td>
                        <td className="py-3">
                          {l.last_clicked
                            ? new Date(l.last_clicked).toLocaleString()
                            : "Never"}
                        </td>
                        <td className="py-3">
                          {new Date(l.created_at).toLocaleString()}
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
                              href={`/code/${l.code}`}
                              className="px-3 py-1 bg-green-600/80 text-white rounded-lg hover:bg-green-600 transition"
                            >
                              View
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

         
              <div className="flex justify-between items-center text-white/80 text-sm mt-4">
                <span>
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length}
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
      </div>
    </div>
  );
}
