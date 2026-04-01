import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

export default async function ClinicDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/clinic" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Network
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Clinic Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Viewing data for clinic ID: {resolvedParams.id}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
        <p className="text-slate-500 font-medium">This is a placeholder for the individual clinic dashboard.</p>
      </div>
    </div>
  );
}
