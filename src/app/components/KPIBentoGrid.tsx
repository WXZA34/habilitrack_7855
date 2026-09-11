import React from 'react';
import { ShieldX, AlertTriangle, Clock, Users, CalendarCheck,  } from 'lucide-react';
import ComplianceGaugeCard from './ComplianceGaugeCard';
import Icon from '@/components/ui/AppIcon';


// Grid plan: 6 cards → grid-cols-4
// Row 1: hero gauge spans 2 cols + 2 regular cards
// Row 2: 4 regular cards (but only 3 remain after hero) → 3 cards span 4/3 each? 
// Adjusted: hero spans 2 cols, row1 = hero(2) + 2 cards, row2 = 3 cards spanning full width (1+1+2 or 4-col with last spanning 2)
// Final: grid-cols-4, row1: hero(2col) + card + card; row2: card + card + card(2col)

const kpiCards = [
  {
    id: 'kpi-expired',
    label: 'Habilitations expirées',
    value: '4',
    subtext: 'Risque légal immédiat',
    icon: ShieldX,
    variant: 'danger' as const,
    change: '+2 vs semaine dernière',
    changeDir: 'bad' as const,
  },
  {
    id: 'kpi-critical',
    label: 'Expirent dans 30 jours',
    value: '3',
    subtext: 'Action urgente requise',
    icon: AlertTriangle,
    variant: 'warning' as const,
    change: 'dont 2 habilitations élec.',
    changeDir: 'neutral' as const,
  },
  {
    id: 'kpi-soon',
    label: 'Expirent dans 60 jours',
    value: '7',
    subtext: 'À planifier maintenant',
    icon: Clock,
    variant: 'info' as const,
    change: '5 CACES + 2 SST',
    changeDir: 'neutral' as const,
  },
  {
    id: 'kpi-noncompliant',
    label: 'Salariés non conformes',
    value: '5',
    subtext: 'Sur 12 salariés actifs',
    icon: Users,
    variant: 'warning' as const,
    change: '41.7% de l\'effectif',
    changeDir: 'bad' as const,
  },
  {
    id: 'kpi-sessions',
    label: 'Sessions planifiées',
    value: '5',
    subtext: 'Juin — Août 2026',
    icon: CalendarCheck,
    variant: 'success' as const,
    change: '9 salariés concernés',
    changeDir: 'good' as const,
  },
];

const variantClasses = {
  danger: 'alert-gradient border-red-200',
  warning: 'warning-gradient border-amber-200',
  info: 'compliance-gradient border-blue-200',
  success: 'success-gradient border-green-200',
};

const iconClasses = {
  danger: 'text-red-600 bg-red-100',
  warning: 'text-amber-600 bg-amber-100',
  info: 'text-primary bg-blue-100',
  success: 'text-green-600 bg-green-100',
};

const valueClasses = {
  danger: 'text-red-700',
  warning: 'text-amber-700',
  info: 'text-primary',
  success: 'text-green-700',
};

export default function KPIBentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 max-w-screen-2xl">
      {/* Hero — compliance gauge spans 2 cols */}
      <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2">
        <ComplianceGaugeCard />
      </div>

      {/* Cards 1 & 2 */}
      {kpiCards.slice(0, 2).map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`metric-card border p-4 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${variantClasses[card.variant]}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${iconClasses[card.variant]}`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-500 text-muted-foreground leading-tight text-right max-w-[120px]">
                {card.subtext}
              </span>
            </div>
            <div>
              <p className={`tabular-nums text-3xl font-800 leading-none mb-1 ${valueClasses[card.variant]}`}>
                {card.value}
              </p>
              <p className="text-sm font-600 text-foreground leading-tight">{card.label}</p>
            </div>
            <p className="text-xs text-muted-foreground border-t border-border/60 pt-2">{card.change}</p>
          </div>
        );
      })}

      {/* Cards 3, 4, 5 — row 2: 3 cards, last spans 2 to fill 4-col grid */}
      {kpiCards.slice(2, 4).map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`metric-card border p-4 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${variantClasses[card.variant]}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${iconClasses[card.variant]}`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-500 text-muted-foreground leading-tight text-right max-w-[120px]">
                {card.subtext}
              </span>
            </div>
            <div>
              <p className={`tabular-nums text-3xl font-800 leading-none mb-1 ${valueClasses[card.variant]}`}>
                {card.value}
              </p>
              <p className="text-sm font-600 text-foreground leading-tight">{card.label}</p>
            </div>
            <p className="text-xs text-muted-foreground border-t border-border/60 pt-2">{card.change}</p>
          </div>
        );
      })}

      {/* Last card spans 2 cols to fill the row */}
      {(() => {
        const card = kpiCards[4];
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 metric-card border p-4 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${variantClasses[card.variant]}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${iconClasses[card.variant]}`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-500 text-muted-foreground leading-tight text-right max-w-[200px]">
                {card.subtext}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className={`tabular-nums text-3xl font-800 leading-none mb-1 ${valueClasses[card.variant]}`}>
                  {card.value}
                </p>
                <p className="text-sm font-600 text-foreground leading-tight">{card.label}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {['CACES R489', 'Hab. Élec.', 'SST', 'Hauteur', 'ATEX'].map((type) => (
                  <span key={`sess-type-${type}`} className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground border-t border-border/60 pt-2">{card.change}</p>
          </div>
        );
      })()}
    </div>
  );
}