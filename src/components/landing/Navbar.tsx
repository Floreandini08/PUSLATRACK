"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Timer } from "lucide-react";

const NAV_LINKS = [
  { href: "#fitur", label: "Fitur Utama" },
  { href: "#peran", label: "Akses Peran" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#mengapa", label: "Keunggulan" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-amber-400 p-2.5 rounded-xl text-slate-900 shadow-lg shadow-amber-400/20">
              <Timer className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Puslat<span className="text-amber-400">Track</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded-full ml-2 border border-slate-700">
                KONI &amp; Puslatkot
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-slate-300 hover:text-amber-400 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-200 font-medium text-sm hover:bg-slate-800 hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold text-sm shadow-md hover:shadow-amber-400/20 transition-all transform hover:-translate-y-0.5"
            >
              Coba Sekarang
            </Link>
          </div>

          <button
            type="button"
            aria-label="Buka menu navigasi"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-slate-300 hover:text-amber-400 focus:outline-none p-2"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-slate-300 hover:text-amber-400 font-medium"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col space-y-2 border-t border-slate-800">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-slate-200 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 rounded-xl bg-amber-400 text-slate-950 font-semibold"
            >
              Coba Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
