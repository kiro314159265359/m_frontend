"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import type { StaffRole } from "@/app/types";

interface NavItem {
  label: string;
  href: string;
  roles: StaffRole[];
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",    href: "/dashboard",    roles: ["Admin"],                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Staff",        href: "/staff",        roles: ["Admin"],                icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "Reservations", href: "/reservations", roles: ["Reception", "Admin"],   icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Check-in",     href: "/checkin",      roles: ["Reception", "Admin"],   icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" },
  { label: "Rooms",        href: "/rooms",        roles: ["Reception", "Admin"],   icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Folio",        href: "/folio",        roles: ["Cashier", "Admin"],     icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "Room Status",  href: "/room-status",  roles: ["RoomService", "Admin"], icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { label: "Inventory",    href: "/inventory",    roles: ["RoomService", "Admin"], icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Add Charge",   href: "/charge",       roles: ["Restaurant", "Admin"],  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export function Sidebar() {
  const { user, logout, isRole } = useAuth();
  const pathname = usePathname();
  const visible = NAV_ITEMS.filter((item) => isRole(...item.roles));

  return (
    <aside className="w-[260px] h-screen bg-sidebar flex flex-col shrink-0 select-none">

      {/* Logo */}
      <div className="px-7 py-7 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/40">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <span className="text-[15px] font-bold text-white tracking-tight">Aura Hotel</span>
          <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Management System</p>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-7 pt-3 pb-2">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em]">Menu</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-0.5 overflow-y-auto">
        {visible.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
                ${active
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-slate-400 hover:bg-sidebar-hover hover:text-slate-200"
                }
              `}
            >
              <svg
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 mx-3 mb-3 bg-sidebar-hover rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            {user?.fullName?.charAt(0) ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
            <p className="text-[11px] text-brand-300 font-medium">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 bg-sidebar rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}