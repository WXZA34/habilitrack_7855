'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';
import { monthlyExpirations } from '@/lib/mockData';

// Backend integration point: fetch monthlyExpirations from /api/habilitations/expirations-by-month

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, p) => acc + p.value, 0);
    return (
      <div className="bg-card border border-border rounded-lg shadow-modal p-3 min-w-[160px]">
        <p className="text-xs font-700 text-foreground mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={`tt-exp-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="tabular-nums text-xs font-700 text-foreground">{entry.value}</span>
          </div>
        ))}
        <div className="border-t border-border mt-1 pt-1 flex justify-between">
          <span className="text-xs font-600 text-muted-foreground">Total</span>
          <span className="tabular-nums text-xs font-800 text-foreground">{total}</span>
        </div>
      </div>
    );
  }
  return null;
};

type FilterKey = 'all' | 'caces' | 'electrique' | 'sst' | 'autres';

export default function ExpirationTimelineChart() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filters: { key: FilterKey; label: string; color: string }[] = [
    { key: 'all', label: 'Tous', color: '' },
    { key: 'caces', label: 'CACES', color: '#1D4ED8' },
    { key: 'electrique', label: 'Électrique', color: '#7C3AED' },
    { key: 'sst', label: 'SST', color: '#16A34A' },
    { key: 'autres', label: 'Autres', color: '#D97706' },
  ];

  return (
    <div className="metric-card border shadow-card p-5 max-w-screen-2xl">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-700 text-foreground">Volume d'expirations par mois</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Anticipez les formations — groupez par type d'habilitation</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={`filter-chart-${f.key}`}
              onClick={() => setActiveFilter(f.key)}
              className={`text-xs font-600 px-2.5 py-1 rounded-full border transition-all duration-150 ${
                activeFilter === f.key
                  ? 'bg-primary text-white border-primary' :'bg-card text-muted-foreground border-border hover:border-primary/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyExpirations} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="mois"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {(activeFilter === 'all' || activeFilter === 'caces') && (
              <Bar dataKey="caces" name="CACES" stackId="stack" fill="#1D4ED8" radius={activeFilter === 'caces' ? [4, 4, 0, 0] : [0, 0, 0, 0]} maxBarSize={40} />
            )}
            {(activeFilter === 'all' || activeFilter === 'electrique') && (
              <Bar dataKey="electrique" name="Électrique" stackId="stack" fill="#7C3AED" radius={[0, 0, 0, 0]} maxBarSize={40} />
            )}
            {(activeFilter === 'all' || activeFilter === 'sst') && (
              <Bar dataKey="sst" name="SST" stackId="stack" fill="#16A34A" radius={[0, 0, 0, 0]} maxBarSize={40} />
            )}
            {(activeFilter === 'all' || activeFilter === 'autres') && (
              <Bar dataKey="autres" name="Autres" stackId="stack" fill="#D97706" radius={[4, 4, 0, 0]} maxBarSize={40} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-3 border-t border-border pt-3 flex-wrap">
        {[
          { color: 'bg-primary', label: 'CACES' },
          { color: 'bg-purple-600', label: 'Électrique' },
          { color: 'bg-green-600', label: 'SST' },
          { color: 'bg-amber-600', label: 'Autres' },
        ].map((item) => (
          <div key={`legend-chart-${item.label}`} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
        <div className="ml-auto text-xs text-muted-foreground">
          Total sur 12 mois : <span className="font-700 text-foreground">
            {monthlyExpirations.reduce((acc, m) => acc + m.caces + m.electrique + m.sst + m.autres, 0)}
          </span> habilitations à renouveler
        </div>
      </div>
    </div>
  );
}