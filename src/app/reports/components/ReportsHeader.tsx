'use client';

import React, { useState } from 'react';
import { BarChart3, Download, FileText, Shield, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const DATE_RANGES = [
  { id: 'range-1m', label: '1 mois' },
  { id: 'range-3m', label: '3 mois' },
  { id: 'range-6m', label: '6 mois' },
  { id: 'range-1y', label: '1 an' },
];

const SITES = [
  { id: 'site-all', label: 'Tous les sites' },
  { id: 'site-bx', label: 'Site Bordeaux' },
  { id: 'site-ly', label: 'Site Lyon' },
  { id: 'site-cn', label: 'Chantier Nord' },
];

export default function ReportsHeader() {
  const [dateRange, setDateRange] = useState('range-6m');
  const [site, setSite] = useState('site-all');
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: string) => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setExporting(false);
    toast.success(`Rapport exporté en ${format} — prêt pour inspection du travail`);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-5 border-b border-border bg-card">
      <div className="flex items-start justify-between gap-4 max-w-screen-2xl flex-wrap">
        <div>
          <h1 className="text-2xl font-700 text-foreground tracking-tight flex items-center gap-2.5 mb-1">
            <BarChart3 size={22} className="text-primary" />
            Rapports de conformité
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 text-xs font-600 px-2 py-1 rounded-md bg-green-50 border border-green-200 text-green-700">
              <Shield size={12} />
              Prêt pour inspection du travail
            </div>
            <span className="text-xs text-muted-foreground">Dernière mise à jour : 22/05/2026 14h38</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range selector */}
          <div className="flex items-center border border-border rounded-md overflow-hidden bg-card">
            {DATE_RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setDateRange(r.id)}
                className={`px-3 py-1.5 text-xs font-600 transition-colors border-r border-border last:border-r-0 ${
                  dateRange === r.id
                    ? 'bg-primary text-white' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Site selector */}
          <div className="relative">
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs border border-border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground font-500"
            >
              {SITES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {/* Export buttons */}
          <button
            onClick={() => handleExport('PDF')}
            disabled={exporting}
            className="btn-secondary text-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                Export...
              </span>
            ) : (
              <>
                <FileText size={14} />
                PDF
              </>
            )}
          </button>
          <button
            onClick={() => handleExport('Excel')}
            disabled={exporting}
            className="btn-primary text-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Excel
          </button>
        </div>
      </div>
    </div>
  );
}