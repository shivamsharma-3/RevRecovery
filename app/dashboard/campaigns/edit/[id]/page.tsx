'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ChevronRight, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { logAuditAction } from '@/lib/audit';

export default function EditCampaign() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    status: 'Running',
    rate: '0%',
    roi: '0x',
    volume: '$0',
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!user || !campaignId) return;
      
      try {
        const docRef = doc(db, 'users', user.uid, 'campaigns', campaignId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            status: data.status || 'Running',
            rate: data.rate || '0%',
            roi: data.roi || '0x',
            volume: data.volume || '$0',
          });
        } else {
          setError("Campaign not found");
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [user, campaignId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !campaignId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const docRef = doc(db, 'users', user.uid, 'campaigns', campaignId);
      await updateDoc(docRef, {
        name: formData.name,
        status: formData.status,
        rate: formData.rate,
        roi: formData.roi,
        volume: formData.volume,
        updatedAt: serverTimestamp(),
      });
      
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Updated Campaign',
        target: formData.name,
        status: 'Success',
        severity: 'Low',
        type: 'campaign'
      });

      router.push('/dashboard/campaigns');
    } catch (err: any) {
      console.error('Error updating campaign:', err);
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Campaign Update Failed',
        target: formData.name,
        status: 'Failed',
        severity: 'Medium',
        type: 'campaign'
      });
      setError(err.message || 'Failed to update campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="p-4 md:p-6 max-w-3xl mx-auto flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 max-w-3xl mx-auto">
      <header className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-4 tracking-wide uppercase">
          <Link href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-2.5 h-2.5" />
          <Link href="/dashboard/campaigns" className="hover:text-teal-600 transition-colors">Campaigns</Link>
          <ChevronRight className="w-2.5 h-2.5" />
          <span className="text-teal-600">Edit Campaign</span>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard/campaigns">
            <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1 font-headline">Edit Campaign</h2>
            <p className="text-slate-500 text-sm font-medium">Update the configuration of your recovery protocol.</p>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Campaign Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              >
                <option value="Running">Running</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="rate" className="block text-sm font-bold text-slate-700 mb-2">Target Success Rate</label>
              <input
                type="text"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="roi" className="block text-sm font-bold text-slate-700 mb-2">Expected ROI</label>
              <input
                type="text"
                id="roi"
                name="roi"
                value={formData.roi}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="volume" className="block text-sm font-bold text-slate-700 mb-2">Target Volume</label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/dashboard/campaigns">
              <button
                type="button"
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
