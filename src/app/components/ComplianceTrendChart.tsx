'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,  } from 'recharts';
import { complianceTrend } from '@/lib/mockData';
import { TrendingDown } from 'lucide-react';

// Backend integration point: fetch complianceTrend from /api/compliance/trend?weeks=12

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
          <div key={`tt-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
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

export default function ComplianceTrendChart() {
  return (
    <div className="metric-card border p-5 shadow-card h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-700 text-foreground">Évolution du taux de conformité</h3>
          <p className="text-xs text-muted-foreground mt-0.5">12 dernières semaines</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-600 text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
          <TrendingDown size={12} />
          −19pts depuis S10
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={complianceTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradTaux" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="semaine"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={80} stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Seuil 80%', position: 'insideTopRight', fontSize: 10, fill: '#DC2626' }} />
            <Area
              type="monotone"
              dataKey="taux"
              name="Taux (%)"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#gradTaux)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--primary)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-3 border-t border-border pt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-primary rounded" />
          <span className="text-xs text-muted-foreground">Taux conformité</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-red-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #DC2626 0, #DC2626 4px, transparent 4px, transparent 8px)' }} />
          <span className="text-xs text-muted-foreground">Seuil légal (80%)</span>
        </div>
      </div>
    </div>
  );
}