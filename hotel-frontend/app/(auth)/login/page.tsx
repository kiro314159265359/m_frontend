"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { authApi } from "@/app/lib/api";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import type { StaffRole } from "@/app/types";

function defaultRoute(role: StaffRole): string {
  switch (role) {
    case "Admin":       return "/dashboard";
    case "Reception":   return "/reservations";
    case "Cashier":     return "/folio";
    case "RoomService": return "/room-status";
    case "Restaurant":  return "/charge";
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const router    = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      login(res.token, res.fullName, res.role, res.staffId);
      document.cookie = `hotel_auth=${encodeURIComponent(
        JSON.stringify({ role: res.role })
      )}; path=/; max-age=${60 * 60 * 12}`;
      router.push(defaultRoute(res.role as StaffRole));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-sidebar relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/40">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Aura Hotel</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Hospitality,<br />
            <span className="text-brand-400">Streamlined.</span>
          </h1>
          <p className="mt-4 text-slate-400 text-[15px] leading-relaxed max-w-sm">
            Manage reservations, rooms, staff and billing — all from a single, beautiful interface.
          </p>
        </div>

        <p className="relative z-10 text-[12px] text-slate-600">&copy; 2025 Aura Hotel Management</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-10">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Aura Hotel</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to access your dashboard.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => { setError(""); setUsername(e.target.value); }}
              autoComplete="username"
              autoFocus
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setError(""); setPassword(e.target.value); }}
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 animate-fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full h-11">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}