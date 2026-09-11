'use client';

import React, { useState } from 'react';
import { trainingSessions, employees } from '@/lib/mockData';
import SessionStatusBadge from '@/components/ui/SessionStatusBadge';
import {
  CalendarCheck,
  MapPin,
  Building2,
  Users,
  Euro,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

// Backend integration point: fetch trainingSessions from /api/sessions?upcoming=true

export default function SessionCards() {
  const [sessions] = useState(trainingSessions);

  const getParticipantNames = (ids: string[]) =>
    ids.map((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp ? `${emp.prenom} ${emp.nom}` : id;
    });

  const handleConfirm = (id: string, type: string) => {
    toast.success(`Session "${type}" confirmée`);
  };

  const totalCost = sessions.reduce((acc, s) => acc + s.cout, 0);

  return (
    <div className="metric-card border shadow-card flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
            <CalendarCheck size={15} className="text-primary" />
            Sessions planifiées
            <span className="text-xs font-600 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {sessions.length}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Budget estimé :{' '}
            <span className="font-700 text-foreground tabular-nums">{totalCost.toLocaleString('fr-FR')} €</span>
          </p>
        </div>
        <button
          onClick={() => toast.info('Formulaire de création de session')}
          className="btn-primary text-xs py-1.5 px-3"
        >
          <Plus size={13} />
          Ajouter
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/60">
        {sessions.map((session) => {
          const participantNames = getParticipantNames(session.participants);
          const spotsLeft = session.capaciteMax - session.participants.length;
          const fillPct = Math.round((session.participants.length / session.capaciteMax) * 100);
          const sessionDate = new Date(session.dateSession);
          const dayStr = sessionDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
          const yearStr = sessionDate.getFullYear().toString();

          return (
            <div
              key={session.id}
              className="p-4 hover:bg-muted/20 transition-colors group"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-start gap-3">
                  {/* Date block */}
                  <div className="shrink-0 w-12 text-center">
                    <div className="bg-primary rounded-t-md px-1 py-0.5">
                      <p className="text-[9px] font-700 text-white/80 uppercase tracking-wider">{yearStr}</p>
                    </div>
                    <div className="border border-t-0 border-border rounded-b-md px-1 py-1 bg-card">
                      <p className="text-xs font-800 text-foreground tabular-nums leading-tight">{dayStr}</p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-700 text-foreground leading-tight mb-0.5">{session.type}</p>
                    <SessionStatusBadge statut={session.statut} />
                  </div>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                  aria-label="Voir les détails"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 size={12} className="shrink-0" />
                  <span className="truncate">{session.organismeFormateur}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">{session.lieu}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Euro size={12} className="shrink-0" />
                  <span className="tabular-nums font-600 text-foreground">{session.cout} €</span>
                  <span className="text-muted-foreground">/ participant</span>
                </div>
              </div>

              {/* Participants */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users size={12} />
                    <span>{session.participants.length}/{session.capaciteMax} participants</span>
                    {spotsLeft > 0 && (
                      <span className="text-blue-600 font-600">· {spotsLeft} place{spotsLeft > 1 ? 's' : ''} libre{spotsLeft > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <span className="tabular-nums text-xs font-700 text-foreground">{fillPct}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                {/* Participant avatars */}
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {participantNames.map((name, idx) => (
                    <div
                      key={`part-${session.id}-${idx}`}
                      className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5"
                      title={name}
                    >
                      <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-700">
                        {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-[10px] font-500 text-foreground max-w-[80px] truncate">{name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {session.statut === 'Planifiée' && (
                <button
                  onClick={() => handleConfirm(session.id, session.type)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-600 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <CheckCircle2 size={12} />
                  Confirmer la session
                </button>
              )}
              {session.statut === 'Confirmée' && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-600 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle2 size={12} />
                  Session confirmée — convocations à envoyer
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={12} />
            <span>Prochain : session CACES le 10/06/2026</span>
          </div>
          <button className="font-600 text-primary hover:underline">
            Voir toutes →
          </button>
        </div>
      </div>
    </div>
  );
}