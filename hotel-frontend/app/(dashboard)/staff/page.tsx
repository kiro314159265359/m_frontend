"use client";

import { useEffect, useState } from "react";
import { staffApi } from "@/app/lib/api";
import { Badge } from "@/app/components/ui/Badge";
import { Spinner, EmptyState, ErrorBox } from "@/app/components/ui/States";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/app/components/ui/Table";
import type { Staff } from "@/app/types";

const roleColor = (r: string) => {
  switch(r) { 
    case "Admin": return "maintenance" as const; 
    case "Reception": return "available" as const; 
    case "Cashier": return "occupied" as const; 
    case "RoomService": return "dirty" as const; 
    case "Restaurant": return "pending" as const; 
    default: return "default" as const; 
  }
};

const roleIcon: Record<string, string> = {
  Admin: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a9 9 0 11-18 0 9 9 0 0118 0zM9 9h.01M15 9h.01",
  Reception: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  Cashier: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  RoomService: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  Restaurant: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { 
    staffApi.getAll()
      .then(setStaff)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false)); 
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox title="Failed to load staff" message={error} />;

  const activeCount = staff.filter(s => s.isActive).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Directory</h1>
        <p className="text-sm text-gray-500 mt-2">Manage all hotel personnel and roles.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="premium-card p-6">
          <p className="text-sm text-gray-600 mb-2">Total Staff</p>
          <p className="text-4xl font-bold text-gray-900">{staff.length}</p>
        </div>
        <div className="premium-card p-6">
          <p className="text-sm text-gray-600 mb-2">Active Employees</p>
          <p className="text-4xl font-bold text-emerald-600">{activeCount}</p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="premium-card overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Employees</h2>
        </div>
        {staff.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="No Staff Members"
            description="No employees have been registered yet."
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow hoverable={false}>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-200 to-brand-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {s.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{s.fullName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">{s.username}</TableCell>
                  <TableCell>
                    <Badge label={s.role} variant={roleColor(s.role)} />
                  </TableCell>
                  <TableCell>
                    <Badge 
                      label={s.isActive ? "Active" : "Inactive"} 
                      variant={s.isActive ? "available" : "default"} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
