'use client';

import React, { useEffect, useState } from 'react';
import { TrendingDown, ShieldAlert } from 'lucide-react';

const COMPLIANCE_RATE = 72;
const CIRCUMFERENCE = 251.2; // 2 * PI * 40

export default function ComplianceGaugeCard() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const dashOffset = animated
    ? CIRCUMFERENCE - (COMPLIANCE_RATE / 100) * CIRCUMFERENCE
    : CIRCUMFERENCE;

  const getColor = (rate: number) => {
    if (rate >= 90) return '#16A34A';
    if (rate >= 75) return '#D97706';
    return '#DC2626';
  };

  const color = getColor(COMPLIANCE_RATE);

  return (
    <div className="metric-card border border-red-200 p-5 flex flex-col gap-4 shadow-card hover:shadow-card-hover transition-shadow duration-200 h-full alert-gradient">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-0.5">
            Taux de conformité global
          </p>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-600" />
            <span className="text-xs font-600 text-red-700">En dessous du seuil légal (80%)</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-600 text-red-600">
          <TrendingDown size={14} />
          <span>−5pts vs S20</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* SVG Gauge */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="tabular-nums text-2xl font-800 leading-none" style={{ color }}>{COMPLIANCE_RATE}%</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2">
          {[
            { label: 'Valides', count: 13, color: '#16A34A', bg: 'bg-green-500' },
            { label: 'À renouveler', count: 2, color: '#D97706', bg: 'bg-amber-500' },
            { label: 'Critiques', count: 3, color: '#DC2626', bg: 'bg-red-400' },
            { label: 'Expirées', count: 4, color: '#7C3AED', bg: 'bg-purple-500' },
          ].map((item) => (
            <div key={`gauge-item-${item.label}`} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shrink-0 ${item.bg}`} />
              <span className="text-xs text-muted-foreground flex-1">{item.label}</span>
              <span className="tabular-nums text-xs font-700" style={{ color: item.color }}>{item.count}</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(item.count / 22) * 100}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-red-200 pt-3">
        <span className="text-xs text-muted-foreground">22 habilitations suivies</span>
        <span className="text-xs font-600 text-red-700 flex items-center gap-1">
          Objectif : 95% <span className="text-muted-foreground font-400">— écart : −23pts</span>
        </span>
      </div>
    </div>
  );
}