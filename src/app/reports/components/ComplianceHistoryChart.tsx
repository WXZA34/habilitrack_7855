'use client';

import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,  } from 'recharts';
import { complianceHistory } from '@/lib/mockData';

// Backend integration point: fetch complianceHistory from /api/reports/compliance-history?months=6

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-modal p-3 min-w-[160px]">
        <p className="text-xs font-700 text-foreground mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={`tt-hist-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="tabular-nums text-xs font-700 text-foreground">
              {entry.name === 'Taux (%)' ? `${entry.value}%` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ComplianceHistoryChart() {
  return (
    <div className="metric-card border p-5 shadow-card h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-700 text-foreground">Historique du taux de conformité</h3>
          <p className="text-xs text-muted-foreground mt-0.5">6 derniers mois — tendance mensuelle</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="tabular-nums text-xs font-600 text-red-600">−22pts</p>
            <p className="text-[10px] text-muted-foreground">Déc 25 → Mai 26</p>
          </div>
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={complianceHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradHistory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="mois"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={[60, 100]}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 8]}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine yAxisId="left" y={80} stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1.5} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="taux"
              name="Taux (%)"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#gradHistory)"
              dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="expirees"
              name="Expirées"
              stroke="#DC2626"
              strokeWidth={2}
              fill="url(#gradExpired)"
              dot={{ r: 3, fill: '#DC2626', strokeWidth: 2, stroke: '#fff' }}
              strokeDasharray="4 2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-5 mt-3 border-t border-border pt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-primary rounded" />
          <span className="text-xs text-muted-foreground">Taux de conformité</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-red-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #DC2626 0, #DC2626 4px, transparent 4px, transparent 6px)' }} />
          <span className="text-xs text-muted-foreground">Habilitations expirées</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-4 h-0.5 rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #DC2626 0, #DC2626 4px, transparent 4px, transparent 8px)' }} />
          <span className="text-xs text-muted-foreground">Seuil légal 80%</span>
        </div>
      </div>
    </div>
  );
}