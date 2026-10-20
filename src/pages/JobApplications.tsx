import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Briefcase,
  Plus,
  ExternalLink,
  Trash2,
  Building,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { db } from '../db/database';
import type { JobStatus, JobTier } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

const TIER_LABELS: Record<JobTier, { label: string; range: string; color: string }> = {
  tier_1_product_high: { label: 'Tier 1: Product (High)', range: '₹12–25 LPA', color: 'text-emerald-700 dark:text-emerald-400' },
  tier_2_product_mid: { label: 'Tier 2: Product (Mid)', range: '₹8–18 LPA', color: 'text-indigo-700 dark:text-indigo-400' },
  tier_3_service_plus: { label: 'Tier 3: Service+', range: '₹7–12 LPA', color: 'text-amber-700 dark:text-amber-400' },
  tier_4_startups: { label: 'Tier 4: Funded Startups', range: '₹8–15 LPA', color: 'text-purple-700 dark:text-purple-400' },
};

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'oa_screening', label: 'OA / Screening' },
  { value: 'technical_round', label: 'Technical Interview' },
  { value: 'hr_round', label: 'HR / Final Round' },
  { value: 'offer', label: '🎉 Offer' },
  { value: 'rejected', label: 'Rejected' },
];

export const JobApplications: React.FC = () => {
  const applications = useLiveQuery(() => db.jobApplications.toArray(), []);

  const [filterTier, setFilterTier] = useState<JobTier | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Software Engineer - Backend');
  const [tier, setTier] = useState<JobTier>('tier_1_product_high');
  const [location, setLocation] = useState('Bengaluru / Remote');
  const [expectedCtc, setExpectedCtc] = useState('₹12-16 LPA');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<JobStatus>('wishlist');

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    await db.jobApplications.add({
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      tier,
      location: location.trim(),
      expectedCtc: expectedCtc.trim(),
      jobUrl: jobUrl.trim(),
      notes: notes.trim(),
      status,
      appliedDate: status !== 'wishlist' ? new Date().toISOString().slice(0, 10) : undefined,
    });

    setIsAddModalOpen(false);
    setCompanyName('');
    setJobUrl('');
    setNotes('');
  };

  const handleUpdateStatus = async (appId: number, newStatus: JobStatus) => {
    await db.jobApplications.update(appId, {
      status: newStatus,
      ...(newStatus === 'applied' ? { appliedDate: new Date().toISOString().slice(0, 10) } : {}),
    });
  };

  const handleDelete = async (appId: number) => {
    if (confirm('Delete this application record?')) {
      await db.jobApplications.delete(appId);
    }
  };

  const filteredApps = (applications || []).filter((app) => {
    const matchesTier = filterTier === 'all' || app.tier === filterTier;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesTier && matchesStatus;
  });

  const appliedCount = applications?.filter((a) => a.status !== 'wishlist').length ?? 0;
  const interviewCount = applications?.filter((a) => ['oa_screening', 'technical_round', 'hr_round'].includes(a.status)).length ?? 0;
  const offerCount = applications?.filter((a) => a.status === 'offer').length ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">4 Target Tiers</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Weeks 19–24 Application Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Job Applications Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track applications across Product High, Mid, Service+, and Startups without fabricated credentials
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Tracked</span>
            <Building className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {applications?.length ?? 0}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Applications Sent</span>
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {appliedCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Rounds</span>
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {interviewCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Offers</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {offerCount}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value as JobTier | 'all')}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Tiers</option>
            <option value="tier_1_product_high">Tier 1: Product (High: ₹12-25L)</option>
            <option value="tier_2_product_mid">Tier 2: Product (Mid: ₹8-18L)</option>
            <option value="tier_3_service_plus">Tier 3: Service+ (₹7-12L)</option>
            <option value="tier_4_startups">Tier 4: Startups (₹8-15L)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as JobStatus | 'all')}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredApps.length} companies
        </span>
      </div>

      {/* Applications Table / Cards */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications tracked yet"
          description="Build your dream list or track active opportunities in the 4 tiers."
          actionText="Add Application"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Expected CTC</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApps.map((app) => {
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{app.companyName}</span>
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-emerald-600"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {app.roleTitle} • {app.location || 'Remote'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold ${TIER_LABELS[app.tier].color}`}>
                          {TIER_LABELS[app.tier].label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {app.expectedCtc || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            app.id && handleUpdateStatus(app.id, e.target.value as JobStatus)
                          }
                          className="text-xs py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                        {app.notes || '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => app.id && handleDelete(app.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Track Job Opportunity"
          description="Add a company to your targeted 4-tier pipeline."
        >
          <form onSubmit={handleAddApplication} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name:
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Razorpay, Freshworks"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role Title:
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Tier:
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as JobTier)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="tier_1_product_high">Tier 1: Product (High: ₹12-25L)</option>
                  <option value="tier_2_product_mid">Tier 2: Product (Mid: ₹8-18L)</option>
                  <option value="tier_3_service_plus">Tier 3: Service+ (₹7-12L)</option>
                  <option value="tier_4_startups">Tier 4: Startups (₹8-15L)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected CTC:
                </label>
                <input
                  type="text"
                  value={expectedCtc}
                  onChange={(e) => setExpectedCtc(e.target.value)}
                  placeholder="e.g. ₹12-16 LPA"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Remote"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pipeline Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Posting URL:
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://careers..."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Interview / Referral Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Target tech stack, referral contact, round timeline..."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Save Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
