'use client';

import React, { useState } from 'react';
import { alerts } from '@/lib/mockData';
import { Bell, AlertTriangle, Clock, CalendarClock, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: fetch alerts from /api/alerts?limit=10&unread=true

const getNiveauConfig = (niveau: string) => {
  if (niveau === 'critique') return {
    icon: AlertTriangle,
    bg: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    badge: 'bg-red-100 text-red-700 border-red-200',
    label: 'Critique',
    dot: 'bg-red-500',
  };
  if (niveau === 'urgent') return {
    icon: Clock,
    bg: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    label: 'Urgent',
    dot: 'bg-amber-500',
  };
  return {
    icon: CalendarClock,
    bg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    label: 'À planifier',
    dot: 'bg-blue-500',
  };
};

export default function AlertFeed() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    toast.success('Alerte marquée comme traitée');
  };

  const handlePlanify = (name: string, type: string) => {
    toast.success(`Session planifiée pour ${name} — ${type}`);
  };

  return (
    <div className="metric-card border shadow-card flex flex-col">
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-foreground" />
          <h3 className="text-sm font-700 text-foreground">Alertes actives</h3>
          <span className="text-xs font-700 px-1.5 py-0.5 rounded-full bg-red-500 text-white">
            {visible.length}
          </span>
        </div>
        <button className="text-xs font-600 text-primary hover:underline whitespace-nowrap">
          Tout voir
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/60 max-h-[480px]">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Bell size={18} className="text-green-600" />
            </div>
            <p className="text-sm font-600 text-foreground mb-1">Aucune alerte active</p>
            <p className="text-xs text-muted-foreground">Toutes les habilitations sont à jour</p>
          </div>
        ) : (
          visible.map((alert) => {
            const config = getNiveauConfig(alert.niveau);
            const Icon = config.icon;
            const isExpired = alert.joursRestants < 0;

            return (
              <div
                key={alert.id}
                className={`p-3.5 group hover:bg-muted/30 transition-colors duration-100 fade-in`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1.5 rounded-md border shrink-0 ${config.bg}`}>
                    <Icon size={13} className={config.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <p className="text-sm font-600 text-foreground leading-tight truncate">
                        {alert.employeeName}
                      </p>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
                        aria-label="Ignorer l'alerte"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight mb-1.5 truncate">
                      {alert.habilitationType}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full border ${config.badge}`}>
                        {config.label}
                      </span>
                      <span className={`tabular-nums text-[10px] font-700 ${isExpired ? 'text-red-700' : 'text-amber-700'}`}>
                        {isExpired
                          ? `Exp. il y a ${Math.abs(alert.joursRestants)}j`
                          : `J-${alert.joursRestants}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{alert.site}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 flex gap-1.5">
                  <button
                    onClick={() => handlePlanify(alert.employeeName, alert.habilitationType)}
                    className="flex-1 text-[11px] font-600 py-1 px-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <CalendarClock size={11} />
                    Planifier
                  </button>
                  <button className="flex-1 text-[11px] font-600 py-1 px-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors flex items-center justify-center gap-1">
                    <ChevronRight size={11} />
                    Voir fiche
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {visible.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{alerts.filter((a) => a.niveau === 'critique' && !dismissed.has(a.id)).length} critiques</span>
            <span>{alerts.filter((a) => a.niveau === 'urgent' && !dismissed.has(a.id)).length} urgentes</span>
            <span>{alerts.filter((a) => a.niveau === 'planifier' && !dismissed.has(a.id)).length} à planifier</span>
          </div>
        </div>
      )}
    </div>
  );
}