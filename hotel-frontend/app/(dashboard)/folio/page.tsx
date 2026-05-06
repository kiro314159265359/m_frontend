"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export default function FolioPage() {
  const router = useRouter();
  const [guestId, setGuestId] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (guestId.trim()) router.push(`/folio/${guestId.trim()}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 mb-6">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Folio Lookup</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">Enter a guest ID to view their invoice.</p>

      <form onSubmit={handleSubmit} className="premium-card p-6 w-full max-w-sm space-y-4">
        <Input label="Guest ID" type="number" placeholder="e.g. 1" value={guestId} onChange={(e) => setGuestId(e.target.value)} required autoFocus />
        <Button type="submit" className="w-full">Search Folio</Button>
      </form>
    </div>
  );
}
