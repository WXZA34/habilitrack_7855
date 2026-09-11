import React from 'react';
import { TrendingDown, ShieldX, CalendarClock, Award } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const kpis = [
  {
    id: 'rkpi-rate',
    label: 'Taux de conformité actuel',
    value: '72%',
    subtext: 'En baisse de 22pts sur 6 mois',
    icon: TrendingDown,
    variant: 'danger' as const,
    detail: 'Objectif : 95%',
  },
  {
    id: 'rkpi-expired',
    label: 'Habilitations expirées (période)',
    value: '4',
    subtext: 'Sur 22 habilitations suivies',
    icon: ShieldX,
    variant: 'danger' as const,
    detail: 'CACES ×2, Sécurité ×2',
  },
  {
    id: 'rkpi-renewed',
    label: 'Renouvellements effectués',
    value: '3',
    subtext: 'Sur la même période',
    icon: Award,
    variant: 'success' as const,
    detail: 'CACES ×1, SST ×2',
  },
  {
    id: 'rkpi-upcoming',
    label: 'Expirations à venir (90j)',
    value: '9',
    subtext: 'Sessions à organiser',
    icon: CalendarClock,
    variant: 'warning' as const,
    detail: 'Budget estimé : 2 250 €',
  },
];

const variantClasses = {
  danger: 'alert-gradient border-red-200',
  warning: 'warning-gradient border-amber-200',
  success: 'success-gradient border-green-200',
  info: 'compliance-gradient border-blue-200',
};

const iconClasses = {
  danger: 'text-red-600 bg-red-100',
  warning: 'text-amber-600 bg-amber-100',
  success: 'text-green-600 bg-green-100',
  info: 'text-primary bg-blue-100',
};

const valueClasses = {
  danger: 'text-red-700',
  warning: 'text-amber-700',
  success: 'text-green-700',
  info: 'text-primary',
};

export default function ReportsSummaryKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 max-w-screen-2xl">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`metric-card border p-4 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${variantClasses[kpi.variant]}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${iconClasses[kpi.variant]}`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-500 text-muted-foreground text-right max-w-[120px] leading-tight">
                {kpi.subtext}
              </span>
            </div>
            <div>
              <p className={`tabular-nums text-3xl font-800 leading-none mb-1 ${valueClasses[kpi.variant]}`}>
                {kpi.value}
              </p>
              <p className="text-sm font-600 text-foreground leading-tight">{kpi.label}</p>
            </div>
            <p className="text-xs text-muted-foreground border-t border-border/60 pt-2">{kpi.detail}</p>
          </div>
        );
      })}
    </div>
  );
}