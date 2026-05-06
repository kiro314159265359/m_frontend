"use client";

import { useEffect, useState } from "react";
import { staffApi } from "@/app/lib/api";
import { Badge } from "@/app/components/ui/Badge";
import type { Staff } from "@/app/types";

const roleColor = (r: string) => {
  switch(r) { case "Admin": return "maintenance" as const; case "Reception": return "available" as const; case "Cashier": return "occupied" as const; case "RoomService": return "dirty" as const; case "Restaurant": return "pending" as const; default: return "default" as const; }
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { staffApi.getAll().then(setStaff).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff</h1>
        <p className="text-sm text-gray-500 mt-1">All registered hotel personnel.</p>
      </div>
      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : staff.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No staff found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr><th className="px-6 py-3">Employee</th><th className="px-6 py-3">Username</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">{s.fullName.charAt(0)}</div>
                      <span className="font-semibold text-gray-900">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-600">{s.username}</td>
                  <td className="px-6 py-3.5"><Badge label={s.role} variant={roleColor(s.role)} /></td>
                  <td className="px-6 py-3.5"><Badge label={s.isActive ? "Active" : "Inactive"} variant={s.isActive ? "available" : "default"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
