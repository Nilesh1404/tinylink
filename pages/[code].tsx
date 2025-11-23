// pages/[code].tsx
import { GetServerSideProps } from "next";
import pool from "../lib/db";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const code = params?.code as string;


  const result = await pool.query("SELECT url FROM links WHERE code = $1", [
    code,
  ]);

  if (result.rows.length === 0) {
    res.statusCode = 404;
    return { props: { notFound: true, code } };
  }

  const url = result.rows[0].url;


  await pool.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
    [code]
  );


  return {
    redirect: {
      destination: url,
      permanent: false,
    },
  };
};

export default function RedirectPage({
  notFound,
  code,
}: {
  notFound?: boolean;
  code?: string;
}) {
  if (notFound) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 flex items-center justify-center">
        <div className="backdrop-blur-2xl bg-black/30 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center">

          <h1 className="text-5xl font-extrabold text-white drop-shadow mb-3">404</h1>
          <p className="text-white/80 text-lg mb-8">
            Short link <span className="text-blue-300">/{code}</span> does not exist.
          </p>

          <a
            href="/"
            className="px-6 py-3 bg-white/20 border border-white/30 rounded-xl text-white shadow hover:bg-white/30 transition"
          >
            Go Home
          </a>

        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 flex items-center justify-center">
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center">
        
   
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-white/30 border-t-blue-300 rounded-full animate-spin"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Redirecting…</h1>
        <p className="text-white/70 text-sm">
          Please wait while we open your link.
        </p>

      </div>
    </div>
  );
}
