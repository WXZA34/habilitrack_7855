import React from 'react';
import type { HabilitationStatus } from '@/lib/mockData';

interface StatusBadgeProps {
  statut: HabilitationStatus | string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ statut, size = 'md' }: StatusBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  const getClass = () => {
    switch (statut) {
      case 'Valide': return 'status-badge-valid';
      case 'À renouveler': return 'status-badge-warning';
      case 'Critique': return 'status-badge-critical';
      case 'Expirée': return 'status-badge-expired';
      case 'En cours': return 'status-badge-inprogress';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full font-600 leading-none ${sizeClass} ${getClass()}`}>
      {statut}
    </span>
  );
}