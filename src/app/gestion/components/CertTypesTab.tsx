'use client';

import React, { useState } from 'react';
import { habilitations, certificationTypes } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { ShieldCheck, Plus, TrendingUp, Clock, AlertTriangle, X, Pencil, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface CertType {
  id: string;
  label: string;
  color: string;
}

interface NewCertForm {
  label: string;
  color: string;
}

const PRESET_COLORS = ['#1D4ED8', '#7C3AED', '#16A34A', '#D97706', '#0369A1', '#BE185D', '#DC2626', '#0891B2'];

export default function CertTypesTab() {
  const [selected, setSelected] = useState<string | null>(null);
  const [certList, setCertList] = useState<CertType[]>(certificationTypes);
  const [showNewCert, setShowNewCert] = useState(false);
  const [showEditCert, setShowEditCert] = useState(false);
  const [showAllHabs, setShowAllHabs] = useState(false);

  const [newCertForm, setNewCertForm] = useState<NewCertForm>({ label: '', color: '#1D4ED8' });
  const [editCertForm, setEditCertForm] = useState<NewCertForm>({ label: '', color: '#1D4ED8' });

  const enriched = certList.map((cert: CertType) => {
    const habs = habilitations.filter((h) => h.categorie === cert.label);
    const valide = habs.filter((h) => h.statut === 'Valide').length;
    const aRenouveler = habs.filter((h) => h.statut === 'À renouveler').length;
    const critique = habs.filter((h) => h.statut === 'Critique').length;
    const expiree = habs.filter((h) => h.statut === 'Expirée').length;
    const total = habs.length;
    const tauxConformite = total > 0 ? Math.round(((valide + aRenouveler) / total) * 100) : 100;
    return { ...cert, habs, valide, aRenouveler, critique, expiree, total, tauxConformite };
  });

  const selectedCert = selected ? enriched.find((c) => c.id === selected) : null;

  const handleCreateCert = () => {
    if (!newCertForm.label.trim()) {
      toast.error('Veuillez saisir un nom pour le type d\'habilitation');
      return;
    }
    if (certList.some((c) => c.label.toLowerCase() === newCertForm.label.trim().toLowerCase())) {
      toast.error(`Le type "${newCertForm.label.trim()}" existe déjà`);
      return;
    }
    const newCert: CertType = {
      id: `cert-${Date.now()}`,
      label: newCertForm.label.trim(),
      color: newCertForm.color,
    };
    setCertList((prev) => [...prev, newCert]);
    setShowNewCert(false);
    setNewCertForm({ label: '', color: '#1D4ED8' });
    toast.success(`Type "${newCert.label}" créé avec succès`);
  };

  const handleOpenEdit = () => {
    if (!selectedCert) return;
    setEditCertForm({ label: selectedCert.label, color: selectedCert.color });
    setShowEditCert(true);
  };

  const handleSaveEdit = () => {
    if (!selected || !editCertForm.label.trim()) {
      toast.error('Veuillez saisir un nom');
      return;
    }
    setCertList((prev) =>
      prev.map((c) => c.id === selected ? { ...c, label: editCertForm.label.trim(), color: editCertForm.color } : c)
    );
    setShowEditCert(false);
    toast.success('Type d\'habilitation mis à jour');
  };

  return (
    <div className="flex gap-6">
      {/* Left: Cert Types Grid */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-700 text-foreground">Types d'habilitations</h3>
          <button onClick={() => setShowNewCert(true)} className="btn-primary text-xs py-1.5 px-3">
            <Plus size={13} />
            Nouveau type
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {enriched.map((cert) => (
            <button
              key={cert.id}
              onClick={() => setSelected(cert.id === selected ? null : cert.id)}
              className={`metric-card border shadow-card p-5 text-left transition-all duration-150 hover:shadow-modal ${
                selected === cert.id ? 'border-primary ring-1 ring-primary/20' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cert.color}18` }}>
                  <ShieldCheck size={18} style={{ color: cert.color }} />
                </div>
                <span className="text-xs font-700 tabular-nums px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cert.color}18`, color: cert.color }}>
                  {cert.tauxConformite}%
                </span>
              </div>
              <p className="text-sm font-700 text-foreground mb-1">{cert.label}</p>
              <p className="text-xs text-muted-foreground mb-3">{cert.total} habilitation{cert.total > 1 ? 's' : ''}</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden flex gap-0.5">
                {cert.valide > 0 && <div className="h-full bg-green-500 rounded-full" style={{ width: `${(cert.valide / Math.max(cert.total, 1)) * 100}%` }} />}
                {cert.aRenouveler > 0 && <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(cert.aRenouveler / Math.max(cert.total, 1)) * 100}%` }} />}
                {cert.critique > 0 && <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(cert.critique / Math.max(cert.total, 1)) * 100}%` }} />}
                {cert.expiree > 0 && <div className="h-full bg-red-500 rounded-full" style={{ width: `${(cert.expiree / Math.max(cert.total, 1)) * 100}%` }} />}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {cert.valide > 0 && <span className="text-[10px] text-green-600 font-600">{cert.valide} valide{cert.valide > 1 ? 's' : ''}</span>}
                {cert.critique > 0 && <span className="text-[10px] text-amber-600 font-600">{cert.critique} critique{cert.critique > 1 ? 's' : ''}</span>}
                {cert.expiree > 0 && <span className="text-[10px] text-red-600 font-600">{cert.expiree} expirée{cert.expiree > 1 ? 's' : ''}</span>}
              </div>
            </button>
          ))}
          <button
            onClick={() => setShowNewCert(true)}
            className="metric-card border border-dashed shadow-card p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors min-h-[160px]"
          >
            <Plus size={20} />
            <span className="text-xs font-600">Nouveau type</span>
          </button>
        </div>
      </div>

      {/* Right: Detail Panel */}
      {selectedCert ? (
        <div className="w-72 shrink-0 metric-card border shadow-card flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selectedCert.color}18` }}>
                <ShieldCheck size={18} style={{ color: selectedCert.color }} />
              </div>
              <div>
                <p className="text-sm font-700 text-foreground">{selectedCert.label}</p>
                <p className="text-xs text-muted-foreground">{selectedCert.total} habilitations</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-center">
                <p className="text-lg font-800 text-green-700 tabular-nums">{selectedCert.valide}</p>
                <p className="text-[10px] text-green-600 font-600">Valides</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                <p className="text-lg font-800 text-amber-700 tabular-nums">{selectedCert.critique + selectedCert.aRenouveler}</p>
                <p className="text-[10px] text-amber-600 font-600">À surveiller</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-center">
                <p className="text-lg font-800 text-red-700 tabular-nums">{selectedCert.expiree}</p>
                <p className="text-[10px] text-red-600 font-600">Expirées</p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-center">
                <p className="text-lg font-800 text-primary tabular-nums">{selectedCert.tauxConformite}%</p>
                <p className="text-[10px] text-primary font-600">Conformité</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="px-5 py-3 border-b border-border">
              <p className="text-xs font-700 text-foreground">Habilitations actives</p>
            </div>
            <div className="divide-y divide-border/60">
              {selectedCert.habs.map((hab) => {
                const isExpired = hab.joursRestants < 0;
                const isCritical = hab.joursRestants >= 0 && hab.joursRestants <= 30;
                return (
                  <div key={hab.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className="text-xs font-600 text-foreground">{hab.type}</p>
                      <StatusBadge statut={hab.statut} size="sm" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1">{hab.organismeFormateur}</p>
                    <div className="flex items-center gap-1.5">
                      {isExpired ? (
                        <span className="flex items-center gap-1 text-[10px] font-700 text-red-600">
                          <AlertTriangle size={10} />
                          Expirée
                        </span>
                      ) : isCritical ? (
                        <span className="flex items-center gap-1 text-[10px] font-700 text-amber-600">
                          <Clock size={10} />
                          J-{hab.joursRestants}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-600 text-green-600">
                          <TrendingUp size={10} />
                          J-{hab.joursRestants}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {selectedCert.habs.length === 0 && (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-muted-foreground">Aucune habilitation de ce type</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-3 border-t border-border bg-muted/20 flex gap-2">
            <button
              onClick={handleOpenEdit}
              className="flex-1 btn-secondary text-xs py-1.5 flex items-center justify-center gap-1"
            >
              <Pencil size={12} />
              Modifier
            </button>
            <button
              onClick={() => setShowAllHabs(true)}
              className="flex-1 btn-primary text-xs py-1.5 flex items-center justify-center gap-1"
            >
              <Eye size={12} />
              Voir tout
            </button>
          </div>
        </div>
      ) : (
        <div className="w-72 shrink-0 metric-card border shadow-card flex flex-col items-center justify-center text-center p-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <ShieldCheck size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-600 text-foreground mb-1">Sélectionnez un type</p>
          <p className="text-xs text-muted-foreground">Cliquez sur un type d'habilitation pour voir le détail</p>
        </div>
      )}

      {/* Modal: Nouveau type */}
      {showNewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                Nouveau type d'habilitation
              </h2>
              <button onClick={() => setShowNewCert(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Nom du type *</label>
                <input type="text" value={newCertForm.label} onChange={(e) => setNewCertForm((p) => ({ ...p, label: e.target.value }))} placeholder="CACES, Électrique, Chimique..."
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Couleur</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCertForm((p) => ({ ...p, color }))}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${newCertForm.color === color ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowNewCert(false)} className="flex-1 btn-secondary text-xs py-2">Annuler</button>
              <button onClick={handleCreateCert} className="flex-1 btn-primary text-xs py-2">Créer le type</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Modifier type */}
      {showEditCert && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <Pencil size={16} className="text-primary" />
                Modifier — {selectedCert.label}
              </h2>
              <button onClick={() => setShowEditCert(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Nom du type *</label>
                <input type="text" value={editCertForm.label} onChange={(e) => setEditCertForm((p) => ({ ...p, label: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Couleur</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditCertForm((p) => ({ ...p, color }))}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${editCertForm.color === color ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowEditCert(false)} className="flex-1 btn-secondary text-xs py-2">Annuler</button>
              <button onClick={handleSaveEdit} className="flex-1 btn-primary text-xs py-2">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Voir toutes les habilitations du type */}
      {showAllHabs && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: `${selectedCert.color}18` }}>
                  <ShieldCheck size={14} style={{ color: selectedCert.color }} />
                </div>
                Habilitations — {selectedCert.label}
                <span className="text-xs font-600 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {selectedCert.habs.length}
                </span>
              </h2>
              <button onClick={() => setShowAllHabs(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/60">
              {selectedCert.habs.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-muted-foreground">Aucune habilitation de ce type</p>
                </div>
              ) : (
                selectedCert.habs.map((hab) => {
                  const isExpired = hab.joursRestants < 0;
                  const isCritical = hab.joursRestants >= 0 && hab.joursRestants <= 30;
                  return (
                    <div key={hab.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-600 text-foreground">{hab.type}</p>
                        <p className="text-xs text-muted-foreground">{hab.organismeFormateur} · N° {hab.numeroCertificat}</p>
                        <p className="text-xs text-muted-foreground">
                          Obtenu le {new Date(hab.dateObtention).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })} · 
                          Exp. {new Date(hab.dateExpiration).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge statut={hab.statut} size="sm" />
                        <span className={`text-[10px] font-700 tabular-nums ${isExpired ? 'text-red-600' : isCritical ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          {isExpired ? `J+${Math.abs(hab.joursRestants)}` : `J-${hab.joursRestants}`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{selectedCert.habs.length} habilitation{selectedCert.habs.length > 1 ? 's' : ''} au total</p>
              <button onClick={() => setShowAllHabs(false)} className="btn-secondary text-xs py-1.5 px-3">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
