'use client';

import React, { useState } from 'react';
import { habilitations, employees } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  ChevronUp,
  ChevronDown,
  Search,
  FileText,
  RotateCcw,
  AlertTriangle,
  ChevronsUpDown,
} from 'lucide-react';

// Backend integration point: fetch at-risk habilitations from /api/habilitations?statut=non-valide

type SortKey = 'nom' | 'type' | 'joursRestants' | 'statut' | 'service';
type SortDir = 'asc' | 'desc';

const atRisk = habilitations
  .filter((h) => h.statut !== 'Valide')
  .map((h) => {
    const emp = employees.find((e) => e.id === h.employeeId);
    return { ...h, employee: emp };
  })
  .filter((h) => h.employee !== undefined);

const getCategorieColor = (cat: string) => {
  const map: Record<string, string> = {
    'CACES': 'bg-blue-100 text-blue-700 border-blue-200',
    'Électrique': 'bg-purple-100 text-purple-700 border-purple-200',
    'Sécurité': 'bg-amber-100 text-amber-700 border-amber-200',
    'Santé': 'bg-pink-100 text-pink-700 border-pink-200',
    'Industrie': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  };
  return map[cat] || 'bg-muted text-muted-foreground border-border';
};

export default function AtRiskTable() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('joursRestants');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterStatut, setFilterStatut] = useState<string>('Tous');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = atRisk
    .filter((h) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        h.employee!.nom.toLowerCase().includes(q) ||
        h.employee!.prenom.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q) ||
        h.employee!.service.toLowerCase().includes(q);
      const matchStatut = filterStatut === 'Tous' || h.statut === filterStatut;
      return matchSearch && matchStatut;
    })
    .sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';
      if (sortKey === 'nom') { valA = a.employee!.nom; valB = b.employee!.nom; }
      else if (sortKey === 'type') { valA = a.type; valB = b.type; }
      else if (sortKey === 'joursRestants') { valA = a.joursRestants; valB = b.joursRestants; }
      else if (sortKey === 'statut') { valA = a.statut; valB = b.statut; }
      else if (sortKey === 'service') { valA = a.employee!.service; valB = b.employee!.service; }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={12} className="text-muted-foreground/50" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary" />
      : <ChevronDown size={12} className="text-primary" />;
  };

  return (
    <div className="metric-card border shadow-card">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-500" />
            Habilitations à risque
            <span className="ml-1 text-xs font-600 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              {atRisk.length}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Expirées, critiques et à renouveler</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter chips */}
          {['Tous', 'Expirée', 'Critique', 'À renouveler'].map((s) => (
            <button
              key={`filter-${s}`}
              onClick={() => setFilterStatut(s)}
              className={`text-xs font-600 px-2.5 py-1 rounded-full border transition-all duration-150 ${
                filterStatut === s
                  ? 'bg-primary text-white border-primary' :'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-40 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {[
                { key: 'nom' as SortKey, label: 'Salarié' },
                { key: 'service' as SortKey, label: 'Service' },
                { key: 'type' as SortKey, label: 'Habilitation' },
                { key: null, label: 'N° Certificat' },
                { key: null, label: 'Organisme' },
                { key: null, label: 'Expiration' },
                { key: 'joursRestants' as SortKey, label: 'J. restants' },
                { key: 'statut' as SortKey, label: 'Statut' },
                { key: null, label: 'Actions' },
              ].map((col, i) => (
                <th
                  key={`th-${i}`}
                  className={`px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap ${col.key ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                  onClick={col.key ? () => handleSort(col.key as SortKey) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.key && <SortIcon col={col.key as SortKey} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-sm font-600 text-foreground mb-1">Aucune habilitation trouvée</p>
                  <p className="text-xs text-muted-foreground">Modifiez vos filtres pour voir les résultats</p>
                </td>
              </tr>
            ) : (
              filtered.map((h, idx) => {
                const isExpired = h.joursRestants < 0;
                const isCritical = h.joursRestants >= 0 && h.joursRestants <= 15;
                const rowBg = isExpired ? 'bg-red-50/50' : isCritical ? 'bg-amber-50/30' : '';

                return (
                  <tr
                    key={h.id}
                    className={`border-b border-border/60 group hover:bg-muted/40 transition-colors duration-100 ${rowBg} ${idx % 2 === 0 && !rowBg ? 'bg-white' : ''}`}
                  >
                    {/* Salarié */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-700 shrink-0">
                          {h.employee!.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-600 text-foreground whitespace-nowrap">
                            {h.employee!.prenom} {h.employee!.nom}
                          </p>
                          <p className="text-xs text-muted-foreground">{h.employee!.poste}</p>
                        </div>
                      </div>
                    </td>
                    {/* Service */}
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {h.employee!.service}
                    </td>
                    {/* Habilitation */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-600 text-foreground whitespace-nowrap">{h.type}</span>
                        <span className={`inline-flex w-fit text-[10px] font-600 px-1.5 py-0.5 rounded-full border ${getCategorieColor(h.categorie)}`}>
                          {h.categorie}
                        </span>
                      </div>
                    </td>
                    {/* N° Cert */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-muted-foreground">{h.numeroCertificat}</span>
                    </td>
                    {/* Organisme */}
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {h.organismeFormateur}
                    </td>
                    {/* Expiration */}
                    <td className="px-4 py-3">
                      <span className={`tabular-nums text-sm font-600 whitespace-nowrap ${isExpired ? 'text-red-700' : isCritical ? 'text-amber-700' : 'text-foreground'}`}>
                        {new Date(h.dateExpiration).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </td>
                    {/* J. restants */}
                    <td className="px-4 py-3">
                      <span className={`tabular-nums text-sm font-800 ${
                        isExpired ? 'text-red-700' : isCritical ? 'text-amber-700' : 'text-foreground'
                      }`}>
                        {isExpired ? `J+${Math.abs(h.joursRestants)}` : `J-${h.joursRestants}`}
                      </span>
                    </td>
                    {/* Statut */}
                    <td className="px-4 py-3">
                      <StatusBadge statut={h.statut} />
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          className="p-1.5 rounded-md hover:bg-blue-100 text-muted-foreground hover:text-primary transition-colors"
                          title="Voir le document"
                          aria-label="Voir le document"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          className="p-1.5 rounded-md hover:bg-green-100 text-muted-foreground hover:text-green-700 transition-colors"
                          title="Planifier le renouvellement"
                          aria-label="Planifier le renouvellement"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} sur {atRisk.length} habilitations à risque
        </p>
        <button className="text-xs font-600 text-primary hover:underline">
          Voir toutes les habilitations →
        </button>
      </div>
    </div>
  );
}