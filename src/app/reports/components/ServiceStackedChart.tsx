'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { serviceCompliance } from '@/lib/mockData';

// Backend integration point: fetch serviceCompliance from /api/reports/compliance-by-service

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, p) => acc + p.value, 0);
    return (
      <div className="bg-card border border-border rounded-lg shadow-modal p-3 min-w-[170px]">
        <p className="text-xs font-700 text-foreground mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={`tt-svc-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
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

export default function ServiceStackedChart() {
  return (
    <div className="metric-card border p-5 shadow-card h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-700 text-foreground">Détail par service</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Répartition des statuts</p>
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={serviceCompliance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="service"
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
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
            <Bar dataKey="valide" name="Valide" stackId="s" fill="#16A34A" radius={[0, 0, 0, 0]} maxBarSize={36} />
            <Bar dataKey="aRenouveler" name="À renouveler" stackId="s" fill="#D97706" radius={[0, 0, 0, 0]} maxBarSize={36} />
            <Bar dataKey="critique" name="Critique" stackId="s" fill="#DC2626" radius={[0, 0, 0, 0]} maxBarSize={36} />
            <Bar dataKey="expiree" name="Expirée" stackId="s" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mt-3 border-t border-border pt-3">
        {[
          { color: 'bg-green-600', label: 'Valide' },
          { color: 'bg-amber-600', label: 'À renouveler' },
          { color: 'bg-red-600', label: 'Critique' },
          { color: 'bg-purple-600', label: 'Expirée' },
        ].map((item) => (
          <div key={`legend-svc-${item.label}`} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}