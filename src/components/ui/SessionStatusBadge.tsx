import React from 'react';
import type { SessionStatus } from '@/lib/mockData';

interface SessionStatusBadgeProps {
  statut: SessionStatus;
}

export default function SessionStatusBadge({ statut }: SessionStatusBadgeProps) {
  const getClass = () => {
    switch (statut) {
      case 'Confirmée': return 'status-badge-valid';
      case 'Planifiée': return 'status-badge-inprogress';
      case 'Terminée': return 'bg-muted text-muted-foreground border border-border';
      case 'Annulée': return 'status-badge-expired';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 font-600 leading-none ${getClass()}`}>
      {statut}
    </span>
  );
}