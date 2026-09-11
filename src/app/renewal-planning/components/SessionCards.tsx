'use client';

import React, { useState } from 'react';
import { trainingSessions, employees, TrainingSession } from '@/lib/mockData';
import SessionStatusBadge from '@/components/ui/SessionStatusBadge';
import {
  CalendarCheck, MapPin, Building2, Users, Euro,
  Plus, ChevronRight, CheckCircle2, Clock, X,
  Send, Trash2, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface SessionDetailModalProps {
  session: TrainingSession;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
  onSendConvocations: (id: string) => void;
}

function SessionDetailModal({ session, onClose, onConfirm, onDelete, onSendConvocations }: SessionDetailModalProps) {
  const participantNames = session.participants.map((id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? { id, name: `${emp.prenom} ${emp.nom}`, poste: emp.poste, service: emp.service, avatar: emp.avatar } : null;
  }).filter(Boolean) as { id: string; name: string; poste: string; service: string; avatar: string }[];

  const sessionDate = new Date(session.dateSession);
  const fillPct = Math.round((session.participants.length / session.capaciteMax) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-md flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <CalendarCheck size={16} className="text-primary" />
            <h2 className="text-sm font-700 text-foreground truncate max-w-[280px]">{session.type}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Status + Date */}
          <div className="flex items-center justify-between">
            <SessionStatusBadge statut={session.statut} />
            <span className="text-xs font-600 text-foreground tabular-nums">
              {sessionDate.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Details */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 size={13} className="shrink-0 text-primary" />
              <span className="font-600 text-foreground">{session.organismeFormateur}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={13} className="shrink-0 text-primary" />
              <span>{session.lieu}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Euro size={13} className="shrink-0 text-primary" />
              <span className="tabular-nums font-600 text-foreground">{session.cout} €</span>
              <span>/ participant</span>
              <span className="ml-auto font-700 text-foreground">Total : {(session.participants.length * session.cout).toLocaleString('fr-FR')} €</span>
            </div>
          </div>

          {/* Participants fill */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-600 text-foreground flex items-center gap-1.5">
                <Users size={13} className="text-primary" />
                Participants
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">{session.participants.length}/{session.capaciteMax} ({fillPct}%)</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${fillPct}%` }} />
            </div>
            <div className="space-y-1.5">
              {participantNames.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-muted/30">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-700 shrink-0">
                    {p.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-600 text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.poste} · {p.service}</p>
                  </div>
                </div>
              ))}
              {session.participants.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">Aucun participant inscrit</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border shrink-0 space-y-2">
          {session.statut === 'Planifiée' && (
            <button
              onClick={() => { onConfirm(session.id); onClose(); }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-600 py-2 rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
            >
              <CheckCircle2 size={13} />
              Confirmer la session
            </button>
          )}
          {session.statut === 'Confirmée' && (
            <button
              onClick={() => { onSendConvocations(session.id); onClose(); }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-600 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <Send size={13} />
              Envoyer les convocations ({session.participants.length})
            </button>
          )}
          <button
            onClick={() => { onDelete(session.id); onClose(); }}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-600 py-2 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={13} />
            Supprimer la session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SessionCards() {
  const [sessions, setSessions] = useState<TrainingSession[]>(trainingSessions);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleConfirm = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => s.id === id ? { ...s, statut: 'Confirmée' as const } : s)
    );
    const session = sessions.find((s) => s.id === id);
    if (session) toast.success(`Session "${session.type}" confirmée`);
  };

  const handleDelete = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (session) toast.success(`Session "${session.type}" supprimée`);
  };

  const handleSendConvocations = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      const names = session.participants.map((pid) => {
        const emp = employees.find((e) => e.id === pid);
        return emp ? `${emp.prenom} ${emp.nom}` : pid;
      });
      toast.success(`Convocations envoyées à ${names.length} participant(s)`);
    }
  };

  const totalCost = sessions.reduce((acc, s) => acc + s.cout * s.participants.length, 0);

  // Find next upcoming session
  const nextSession = [...sessions]
    .filter((s) => s.statut !== 'Annulée' && s.statut !== 'Terminée')
    .sort((a, b) => new Date(a.dateSession).getTime() - new Date(b.dateSession).getTime())[0];

  const displayedSessions = showAll ? sessions : sessions.slice(0, 3);

  const getParticipantNames = (ids: string[]) =>
    ids.map((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp ? `${emp.prenom} ${emp.nom}` : id;
    });

  return (
    <>
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
              Budget total :{' '}
              <span className="font-700 text-foreground tabular-nums">{totalCost.toLocaleString('fr-FR')} €</span>
            </p>
          </div>
          <button
            onClick={() => toast.info('Utilisez le bouton "Nouvelle session" en haut de page pour créer une session')}
            className="btn-primary text-xs py-1.5 px-3"
          >
            <Plus size={13} />
            Ajouter
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/60">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <CalendarCheck size={32} className="text-muted-foreground/40 mb-3" />
              <p className="text-sm font-600 text-foreground mb-1">Aucune session planifiée</p>
              <p className="text-xs text-muted-foreground">Créez une nouvelle session via le bouton en haut de page</p>
            </div>
          ) : (
            displayedSessions.map((session) => {
              const participantNames = getParticipantNames(session.participants);
              const spotsLeft = session.capaciteMax - session.participants.length;
              const fillPct = Math.round((session.participants.length / session.capaciteMax) * 100);
              const sessionDate = new Date(session.dateSession);
              const dayStr = sessionDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
              const yearStr = sessionDate.getFullYear().toString();

              return (
                <div key={session.id} className="p-4 hover:bg-muted/20 transition-colors group">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-start gap-3">
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
                      onClick={() => setSelectedSession(session)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                      aria-label="Voir les détails"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

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
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
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

                  {session.statut === 'Planifiée' && (
                    <button
                      onClick={() => handleConfirm(session.id)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-600 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle2 size={12} />
                      Confirmer la session
                    </button>
                  )}
                  {session.statut === 'Confirmée' && (
                    <button
                      onClick={() => handleSendConvocations(session.id)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-600 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <Send size={12} />
                      Envoyer les convocations ({session.participants.length})
                    </button>
                  )}
                </div>
              );
            })
          )}

          {sessions.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-600 text-primary hover:bg-muted/30 transition-colors"
            >
              <ChevronDown size={13} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
              {showAll ? 'Réduire' : `Voir ${sessions.length - 3} session(s) de plus`}
            </button>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock size={12} />
              {nextSession ? (
                <span>
                  Prochain : <span className="font-600 text-foreground">{nextSession.type}</span> le{' '}
                  {new Date(nextSession.dateSession).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </span>
              ) : (
                <span>Aucune session à venir</span>
              )}
            </div>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="font-600 text-primary hover:underline"
            >
              {showAll ? 'Réduire ↑' : 'Voir toutes →'}
            </button>
          </div>
        </div>
      </div>

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onConfirm={handleConfirm}
          onDelete={handleDelete}
          onSendConvocations={handleSendConvocations}
        />
      )}
    </>
  );
}