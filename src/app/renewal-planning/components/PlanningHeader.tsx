'use client';

import React, { useState } from 'react';
import { CalendarClock, Plus, Download, X, Building2, MapPin, Users, Euro, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { employees, trainingSessions } from '@/lib/mockData';

interface NewSessionForm {
  type: string;
  dateSession: string;
  organismeFormateur: string;
  lieu: string;
  capaciteMax: number;
  cout: number;
  participants: string[];
}

const defaultForm: NewSessionForm = {
  type: '',
  dateSession: '',
  organismeFormateur: '',
  lieu: '',
  capaciteMax: 8,
  cout: 0,
  participants: [],
};

const sessionTypes = [
  'CACES R489 cat.1B',
  'CACES R489 cat.3',
  'CACES R489 cat.5',
  'CACES R482 cat.B1',
  'CACES R486 cat.B',
  'CACES R487 cat.1',
  'Habilitation électrique B2V',
  'Habilitation électrique B2T',
  'Habilitation électrique B2V/B2T',
  'Habilitation électrique BC',
  'Habilitation électrique H1V',
  'SST',
  'SST Recyclage',
  'SST Formateur',
  'Travail en hauteur',
  'Gestes et Postures',
  'ATEX Niveau 1',
  'Autre',
];

export default function PlanningHeader() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewSessionForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleExport = () => {
    const lines = [
      'Type,Date,Organisme,Lieu,Participants,Capacité,Coût,Statut',
      ...trainingSessions.map((s) => {
        const names = s.participants
          .map((id) => {
            const emp = employees.find((e) => e.id === id);
            return emp ? `${emp.prenom} ${emp.nom}` : id;
          })
          .join(' | ');
        return `"${s.type}","${s.dateSession}","${s.organismeFormateur}","${s.lieu}","${names}",${s.capaciteMax},${s.cout},"${s.statut}"`;
      }),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planning-renouvellements.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Planning exporté en CSV');
  };

  const toggleParticipant = (id: string) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.includes(id)
        ? prev.participants.filter((p) => p !== id)
        : [...prev.participants, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.dateSession || !form.organismeFormateur || !form.lieu) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success(`Session "${form.type}" créée — ${form.participants.length} participant(s) convoqué(s)`);
      setForm(defaultForm);
      setShowModal(false);
      setSubmitting(false);
    }, 600);
  };

  return (
    <>
      <div className="px-6 lg:px-8 xl:px-10 py-5 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4 max-w-screen-2xl">
          <div>
            <h1 className="text-2xl font-700 text-foreground tracking-tight flex items-center gap-2.5 mb-1">
              <CalendarClock size={22} className="text-primary" />
              Planification des renouvellements
            </h1>
            <p className="text-sm text-muted-foreground">
              Anticipez les renouvellements et groupez les sessions de formation —{' '}
              <span className="font-600 text-foreground">Juin 2026 → Mai 2027</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleExport} className="btn-secondary text-xs">
              <Download size={14} />
              Exporter planning
            </button>
            <button onClick={() => setShowModal(true)} className="btn-primary text-xs">
              <Plus size={14} />
              Nouvelle session
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <CalendarClock size={16} className="text-primary" />
                <h2 className="text-sm font-700 text-foreground">Nouvelle session de formation</h2>
              </div>
              <button
                onClick={() => { setShowModal(false); setForm(defaultForm); }}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1.5">
                    Type d&apos;habilitation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
                    required
                  >
                    <option value="">Sélectionner un type...</option>
                    {sessionTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-600 text-foreground mb-1.5">
                    <Calendar size={12} className="inline mr-1" />
                    Date de la session <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.dateSession}
                    onChange={(e) => setForm((p) => ({ ...p, dateSession: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-600 text-foreground mb-1.5">
                      <Building2 size={12} className="inline mr-1" />
                      Organisme <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.organismeFormateur}
                      onChange={(e) => setForm((p) => ({ ...p, organismeFormateur: e.target.value }))}
                      placeholder="Ex: AFTRAL, AFPA..."
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-600 text-foreground mb-1.5">
                      <MapPin size={12} className="inline mr-1" />
                      Lieu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.lieu}
                      onChange={(e) => setForm((p) => ({ ...p, lieu: e.target.value }))}
                      placeholder="Ex: Site Bordeaux..."
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-600 text-foreground mb-1.5">
                      <Users size={12} className="inline mr-1" />
                      Capacité max
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={form.capaciteMax}
                      onChange={(e) => setForm((p) => ({ ...p, capaciteMax: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-600 text-foreground mb-1.5">
                      <Euro size={12} className="inline mr-1" />
                      Coût / participant (€)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.cout}
                      onChange={(e) => setForm((p) => ({ ...p, cout: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-600 text-foreground mb-1.5">
                    <Users size={12} className="inline mr-1" />
                    Participants ({form.participants.length}/{form.capaciteMax})
                  </label>
                  <div className="border border-border rounded-md bg-background max-h-[160px] overflow-y-auto divide-y divide-border/50">
                    {employees.map((emp) => {
                      const selected = form.participants.includes(emp.id);
                      const disabled = !selected && form.participants.length >= form.capaciteMax;
                      return (
                        <label
                          key={emp.id}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                            selected ? 'bg-primary/5' : disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={disabled}
                            onChange={() => toggleParticipant(emp.id)}
                            className="accent-primary"
                          />
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-700 shrink-0">
                            {emp.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-600 text-foreground">{emp.prenom} {emp.nom}</p>
                            <p className="text-[10px] text-muted-foreground">{emp.poste} · {emp.service}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
                <p className="text-xs text-muted-foreground">
                  {form.participants.length > 0 && form.cout > 0
                    ? `Budget estimé : ${(form.participants.length * form.cout).toLocaleString('fr-FR')} €`
                    : 'Remplissez les champs obligatoires'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setForm(defaultForm); }}
                    className="btn-secondary text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs disabled:opacity-60"
                  >
                    {submitting ? 'Création...' : 'Créer la session'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}