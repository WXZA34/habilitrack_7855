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
  Cell,
} from 'recharts';
import { serviceCompliance } from '@/lib/mockData';

// Backend integration point: fetch serviceCompliance from /api/compliance/by-service

const serviceData = serviceCompliance.map((s) => {
  const total = s.valide + s.aRenouveler + s.critique + s.expiree;
  const rate = total > 0 ? Math.round((s.valide / total) * 100) : 0;
  return { ...s, total, rate };
});

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ payload: typeof serviceData[0] }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg shadow-modal p-3 min-w-[180px]">
        <p className="text-xs font-700 text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs"><span className="text-green-600">Valides</span><span className="font-700 tabular-nums">{d.valide}</span></div>
          <div className="flex justify-between text-xs"><span className="text-amber-600">À renouveler</span><span className="font-700 tabular-nums">{d.aRenouveler}</span></div>
          <div className="flex justify-between text-xs"><span className="text-red-600">Critiques</span><span className="font-700 tabular-nums">{d.critique}</span></div>
          <div className="flex justify-between text-xs"><span className="text-purple-600">Expirées</span><span className="font-700 tabular-nums">{d.expiree}</span></div>
          <div className="flex justify-between text-xs border-t border-border pt-1 mt-1"><span className="font-600">Taux</span><span className="font-800 tabular-nums">{d.rate}%</span></div>
        </div>
      </div>
    );
  }
  return null;
};

const getBarColor = (rate: number) => {
  if (rate >= 90) return '#16A34A';
  if (rate >= 75) return '#D97706';
  return '#DC2626';
};

export default function ServiceComplianceChart() {
  return (
    <div className="metric-card border p-5 shadow-card h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-700 text-foreground">Conformité par service</h3>
          <p className="text-xs text-muted-foreground mt-0.5">% habilitations valides</p>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="service"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]} maxBarSize={14}>
              {serviceData.map((entry) => (
                <Cell key={`cell-service-${entry.service}`} fill={getBarColor(entry.rate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3 mt-3 border-t border-border pt-3">
        {[
          { color: 'bg-green-500', label: '≥90%' },
          { color: 'bg-amber-500', label: '75–89%' },
          { color: 'bg-red-500', label: '<75%' },
        ].map((item) => (
          <div key={`legend-${item.label}`} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}