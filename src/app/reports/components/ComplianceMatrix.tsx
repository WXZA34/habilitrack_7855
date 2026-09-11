'use client';

import React, { useState } from 'react';
import { employees, habilitations } from '@/lib/mockData';

import {
  Grid3X3,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MinusCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// Backend integration point: fetch compliance matrix from /api/reports/compliance-matrix

const CERT_TYPES = [
  { id: 'ct-caces', label: 'CACES', short: 'CACES' },
  { id: 'ct-elec', label: 'Électrique', short: 'Élec.' },
  { id: 'ct-sst', label: 'SST', short: 'SST' },
  { id: 'ct-hauteur', label: 'Travail en hauteur', short: 'Hauteur' },
  { id: 'ct-industrie', label: 'Industrie', short: 'Industrie' },
  { id: 'ct-sante', label: 'Santé', short: 'Santé' },
];

type MatrixCell = {
  statut: string | null;
  joursRestants?: number;
  type?: string;
};

// Build matrix: employee × cert category
const buildMatrix = (): Record<string, Record<string, MatrixCell>> => {
  const matrix: Record<string, Record<string, MatrixCell>> = {};
  employees.forEach((emp) => {
    matrix[emp.id] = {};
    CERT_TYPES.forEach((ct) => {
      const hab = habilitations.find(
        (h) => h.employeeId === emp.id && h.categorie === ct.label
      );
      if (hab) {
        matrix[emp.id][ct.id] = {
          statut: hab.statut,
          joursRestants: hab.joursRestants,
          type: hab.type,
        };
      } else {
        matrix[emp.id][ct.id] = { statut: null };
      }
    });
  });
  return matrix;
};

const matrix = buildMatrix();

const CellIcon = ({ cell }: { cell: MatrixCell }) => {
  if (!cell.statut) return <MinusCircle size={14} className="text-muted-foreground/40" />;
  if (cell.statut === 'Valide') return <CheckCircle2 size={14} className="text-green-600" />;
  if (cell.statut === 'Expirée') return <XCircle size={14} className="text-purple-600" />;
  if (cell.statut === 'Critique') return <AlertCircle size={14} className="text-red-600" />;
  if (cell.statut === 'À renouveler') return <Clock size={14} className="text-amber-600" />;
  if (cell.statut === 'En cours') return <Clock size={14} className="text-blue-600" />;
  return <MinusCircle size={14} className="text-muted-foreground/40" />;
};

const getCellBg = (cell: MatrixCell) => {
  if (!cell.statut) return '';
  if (cell.statut === 'Valide') return 'bg-green-50';
  if (cell.statut === 'Expirée') return 'bg-purple-50';
  if (cell.statut === 'Critique') return 'bg-red-50';
  if (cell.statut === 'À renouveler') return 'bg-amber-50';
  if (cell.statut === 'En cours') return 'bg-blue-50';
  return '';
};

export default function ComplianceMatrix() {
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState('Tous');

  const services = ['Tous', 'Logistique', 'Maintenance', 'Production', 'BTP', 'Santé', 'QSE'];

  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${emp.prenom} ${emp.nom}`.toLowerCase().includes(q) || emp.poste.toLowerCase().includes(q);
    const matchService = filterService === 'Tous' || emp.service === filterService;
    return matchSearch && matchService;
  });

  // Compute per-employee compliance score
  const getEmployeeScore = (empId: string) => {
    const row = matrix[empId];
    const cells = Object.values(row).filter((c) => c.statut !== null);
    if (cells.length === 0) return null;
    const valid = cells.filter((c) => c.statut === 'Valide').length;
    return Math.round((valid / cells.length) * 100);
  };

  const handleExportMatrix = () => {
    toast.success('Matrice de conformité exportée en Excel');
  };

  return (
    <div className="metric-card border shadow-card max-w-screen-2xl">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
            <Grid3X3 size={15} className="text-primary" />
            Matrice de conformité salariés × habilitations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Vue synthétique — prête pour audit ou inspection du travail
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un salarié..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-44 placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-3 py-1.5 text-xs border border-border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground font-500"
          >
            {services.map((s) => (
              <option key={`matrix-svc-${s}`} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleExportMatrix}
            className="btn-secondary text-xs"
          >
            <Download size={13} />
            Exporter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap w-48">
                Salarié
              </th>
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Service
              </th>
              {CERT_TYPES.map((ct) => (
                <th
                  key={ct.id}
                  className="px-3 py-3 text-center text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                  title={ct.label}
                >
                  {ct.short}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={CERT_TYPES.length + 3} className="px-4 py-12 text-center">
                  <p className="text-sm font-600 text-foreground mb-1">Aucun salarié trouvé</p>
                  <p className="text-xs text-muted-foreground">Modifiez votre recherche ou le filtre service</p>
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp, idx) => {
                const score = getEmployeeScore(emp.id);
                const row = matrix[emp.id];

                return (
                  <tr
                    key={emp.id}
                    className={`border-b border-border/60 hover:bg-muted/30 transition-colors duration-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-muted/10'}`}
                  >
                    {/* Employee */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-700 shrink-0">
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-600 text-foreground whitespace-nowrap">
                            {emp.prenom} {emp.nom}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">{emp.poste}</p>
                        </div>
                      </div>
                    </td>
                    {/* Service */}
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {emp.service}
                    </td>
                    {/* Cert columns */}
                    {CERT_TYPES.map((ct) => {
                      const cell = row[ct.id];
                      return (
                        <td
                          key={`cell-${emp.id}-${ct.id}`}
                          className={`px-3 py-3 text-center ${getCellBg(cell)}`}
                          title={cell.statut ? `${cell.type || ct.label} — ${cell.statut}${cell.joursRestants !== undefined ? ` (J${cell.joursRestants < 0 ? '+' : '-'}${Math.abs(cell.joursRestants)})` : ''}` : 'Non requis'}
                        >
                          <div className="flex justify-center">
                            <CellIcon cell={cell} />
                          </div>
                          {cell.statut && cell.joursRestants !== undefined && Math.abs(cell.joursRestants) <= 30 && (
                            <p className={`tabular-nums text-[9px] font-700 mt-0.5 ${cell.joursRestants < 0 ? 'text-red-700' : 'text-amber-700'}`}>
                              {cell.joursRestants < 0 ? `+${Math.abs(cell.joursRestants)}j` : `−${cell.joursRestants}j`}
                            </p>
                          )}
                        </td>
                      );
                    })}
                    {/* Score */}
                    <td className="px-4 py-3 text-center">
                      {score !== null ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className={`tabular-nums text-sm font-800 ${score >= 90 ? 'text-green-700' : score >= 70 ? 'text-amber-700' : 'text-red-700'}`}>
                            {score}%
                          </span>
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${score}%`,
                                backgroundColor: score >= 90 ? '#16A34A' : score >= 70 ? '#D97706' : '#DC2626',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-border bg-muted/20">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="text-xs font-600 text-muted-foreground uppercase tracking-wide">Légende :</span>
          {[
            { Icon: CheckCircle2, color: 'text-green-600', label: 'Valide' },
            { Icon: Clock, color: 'text-amber-600', label: 'À renouveler' },
            { Icon: AlertCircle, color: 'text-red-600', label: 'Critique' },
            { Icon: XCircle, color: 'text-purple-600', label: 'Expirée' },
            { Icon: Clock, color: 'text-blue-600', label: 'En cours' },
            { Icon: MinusCircle, color: 'text-muted-foreground/40', label: 'Non requis' },
          ].map((item) => (
            <div key={`legend-matrix-${item.label}`} className="flex items-center gap-1.5">
              <item.Icon size={13} className={item.color} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
          <div className="ml-auto text-xs text-muted-foreground">
            {filteredEmployees.length} salarié{filteredEmployees.length > 1 ? 's' : ''} affiché{filteredEmployees.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}