"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  History,
  ClipboardList,
  Users,
  ChartLine,
  UserCog,
  Dumbbell,
  User,
  LogOut,
  X,
} from "lucide-react";
import { cn, ROLE_LABEL } from "@/lib/utils";
import type { Role } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["atlet", "pelatih", "admin"] },
  { href: "/dashboard/absensi", label: "Absensi Latihan", icon: Camera, roles: ["atlet"] },
  { href: "/dashboard/riwayat", label: "Riwayat Latihan", icon: History, roles: ["atlet"] },
  { href: "/dashboard/program", label: "Program Latihan", icon: ClipboardList, roles: ["atlet", "pelatih"] },
  { href: "/dashboard/atlet", label: "Monitoring Atlet", icon: Users, roles: ["pelatih"] },
  { href: "/dashboard/monitor", label: "Monitoring KONI", icon: ChartLine, roles: ["admin"] },
  { href: "/dashboard/pengguna", label: "Kelola Pengguna", icon: UserCog, roles: ["admin"] },
  { href: "/dashboard/cabor", label: "Kelola Cabor", icon: Dumbbell, roles: ["admin"] },
  { href: "/dashboard/profil", label: "Profil Saya", icon: User, roles: ["atlet", "pelatih", "admin"] },
];

export function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => i.roles.includes(role));

  return (
    <nav className="flex-1 space-y-1 px-3">
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              active
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/10"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarBrand({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="bg-amber-400 p-2 rounded-lg text-slate-950">
          <Dumbbell className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-extrabold text-white">
          Puslat<span className="text-amber-400">Track</span>
        </span>
      </Link>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white"
          aria-label="Tutup menu"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function SidebarFooter({ role, onLogout }: { role: Role; onLogout: () => void }) {
  return (
    <div className="border-t border-slate-800 p-3">
      <div className="px-4 py-2 mb-2">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
          Peran Akun
        </span>
        <p className="text-sm font-semibold text-amber-400 mt-0.5">
          {ROLE_LABEL[role] ?? role}
        </p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
      >
        <LogOut className="w-[18px] h-[18px]" />
        Keluar
      </button>
    </div>
  );
}
