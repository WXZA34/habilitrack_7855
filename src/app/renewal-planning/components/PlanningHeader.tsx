import React from 'react';
import { CalendarClock, Plus, Download } from 'lucide-react';

export default function PlanningHeader() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 py-5 border-b border-border bg-card">
      <div className="flex items-start justify-between gap-4 max-w-screen-2xl">
        <div>
          <h1 className="text-2xl font-700 text-foreground tracking-tight flex items-center gap-2.5 mb-1">
            <CalendarClock size={22} className="text-primary" />
            Planification des renouvellements
          </h1>
          <p className="text-sm text-muted-foreground">
            Anticipez les renouvellements et groupez les sessions de formation —{' '}
            <span className="font-600 text-foreground">Juin 2026 → Mai 2027</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-secondary text-xs">
            <Download size={14} />
            Exporter planning
          </button>
          <button className="btn-primary text-xs">
            <Plus size={14} />
            Nouvelle session
          </button>
        </div>
      </div>
    </div>
  );
}