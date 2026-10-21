"use client";

import { useState } from "react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { SidebarBrand, SidebarFooter, SidebarNav } from "@/components/dashboard/SidebarNav";
import { logoutAction } from "@/app/dashboard/actions";
import { inisial, ROLE_LABEL } from "@/lib/utils";
import type { Role } from "@/lib/types";

export default function DashboardShell({
  role,
  nama,
  cabor,
  children,
}: {
  role: Role;
  nama: string;
  cabor: string | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-slate-900 border-r border-slate-800 sticky top-0 h-screen">
        <SidebarBrand />
        <SidebarNav role={role} />
        <SidebarFooter role={role} onLogout={() => logoutAction()} />
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 h-full bg-slate-900 border-r border-slate-800 flex flex-col animate-fade-up">
            <SidebarBrand onClose={() => setOpen(false)} />
            <SidebarNav role={role} onNavigate={() => setOpen(false)} />
            <SidebarFooter role={role} onLogout={() => logoutAction()} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="lg:hidden text-slate-600 hover:text-slate-900"
                aria-label="Buka menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-500">Selamat datang kembali,</p>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {nama}
                  {cabor ? (
                    <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {cabor}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white" />
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold">
                  {inisial(nama)}
                </div>
                <div className="hidden md:block leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{nama}</p>
                  <p className="text-[11px] text-slate-500">{ROLE_LABEL[role] ?? role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400">
          &copy; 2026 PuslatTrack &mdash; Kelompok 1 Kelas 2025B, Universitas Negeri
          Surabaya
        </footer>
      </div>
    </div>
  );
}
