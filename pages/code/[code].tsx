// pages/code/[code].tsx
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

interface LinkData {
  code: string;
  url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
}

interface Props {
  link: LinkData | null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.code as string;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/links/${code}`);
  if (res.status === 404) {
    return { props: { link: null } };
  }

  const link = await res.json();

  return { props: { link } };
};

export default function CodeStats({ link }: Props) {
  const [createdAtLocal, setCreatedAtLocal] = useState("");
  const [lastClickedLocal, setLastClickedLocal] = useState("");

  useEffect(() => {
    if (link) {
      setCreatedAtLocal(new Date(link.created_at).toLocaleString());
      setLastClickedLocal(
        link.last_clicked ? new Date(link.last_clicked).toLocaleString() : "Never"
      );
    }
  }, [link]);

  // 🔥 GLASS 404 PAGE
  if (!link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-10 flex items-center justify-center">
        <div className="backdrop-blur-2xl bg-black/30 border border-white/20 rounded-3xl shadow-2xl p-10 text-center text-white max-w-lg w-full">

          <h1 className="text-5xl font-extrabold mb-3">404</h1>
          <p className="text-white/70 mb-8">This short link does not exist.</p>

          <a
            href="/"
            className="px-6 py-3 bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition"
          >
            Go Home
          </a>

        </div>
      </div>
    );
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-10 flex items-center justify-center">

      {/* Main card */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-white">

        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-2 drop-shadow">
          Stats for: <span className="text-blue-300">/{link.code}</span>
        </h1>
        <p className="text-white/70 mb-6">
          Detailed information about your shortened link.
        </p>

        {/* Stats container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Original URL */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/20 p-4 rounded-2xl shadow">
            <p className="text-sm text-white/70">Original URL</p>
            <p className="text-white break-words text-sm mt-1">{link.url}</p>
          </div>

          {/* Total Clicks */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/20 p-4 rounded-2xl shadow">
            <p className="text-sm text-white/70">Total Clicks</p>
            <p className="text-2xl font-bold text-blue-300 mt-1">
              {link.clicks}
            </p>
          </div>

          {/* Last Clicked */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/20 p-4 rounded-2xl shadow">
            <p className="text-sm text-white/70">Last Clicked</p>
            <p className="text-white mt-1">{lastClickedLocal}</p>
          </div>

          {/* Created At */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/20 p-4 rounded-2xl shadow">
            <p className="text-sm text-white/70">Created At</p>
            <p className="text-white mt-1">{createdAtLocal}</p>
          </div>

        </div>

        {/* Copy button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="px-6 py-3 bg-blue-600/80 text-white rounded-xl shadow hover:bg-blue-600 transition border border-white/20"
          >
            Copy Short Link
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/40 text-center mt-8">
          TinyLink — Premium Glass Analytics
        </p>

      </div>
    </div>
  );
}
