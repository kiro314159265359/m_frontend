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
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="p-4 rounded-2xl bg-brand-50 text-brand-600 mb-8">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Guest Folio</h1>
      <p className="text-base text-gray-500 mt-2 mb-10">Look up and view guest invoices</p>

      <form onSubmit={handleSubmit} className="premium-card p-8 w-full max-w-sm space-y-6">
        <div>
          <Input 
            label="Guest ID" 
            type="number" 
            placeholder="Enter guest ID..." 
            value={guestId} 
            onChange={(e) => setGuestId(e.target.value)} 
            required 
            autoFocus 
          />
          <p className="text-xs text-gray-500 mt-2">Enter the guest's ID to retrieve their folio</p>
        </div>
        <Button type="submit" fullWidth variant="primary" size="md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          View Folio
        </Button>
      </form>
    </div>
  );
}
