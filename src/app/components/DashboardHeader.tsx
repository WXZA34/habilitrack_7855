import React from 'react';
import { RefreshCw, Download, AlertTriangle } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 py-5 border-b border-border bg-card">
      <div className="flex items-start justify-between gap-4 max-w-screen-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-700 text-foreground tracking-tight">Tableau de bord conformité</h1>
            <span className="flex items-center gap-1 text-xs font-600 px-2 py-0.5 rounded-full alert-gradient text-red-700 border border-red-200">
              <AlertTriangle size={11} />
              4 habilitations expirées
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Situation au <span className="font-600 text-foreground">22 mai 2026 — 14h38</span>
            <span className="mx-2 text-border">·</span>
            <span className="text-muted-foreground">Site Bordeaux + Site Lyon + Chantier Nord</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-secondary text-xs">
            <RefreshCw size={14} />
            Actualiser
          </button>
          <button className="btn-primary text-xs">
            <Download size={14} />
            Exporter
          </button>
        </div>
      </div>
    </div>
  );
}