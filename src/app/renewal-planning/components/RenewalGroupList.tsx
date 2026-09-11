'use client';

import React, { useState } from 'react';
import { habilitations, employees } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Filter, Users, CalendarPlus, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// Backend integration point: fetch renewals from /api/habilitations/upcoming-renewals

type GroupedRenewal = {
  type: string;
  categorie: string;
  count: number;
  items: Array<{
    id: string;
    employeeId: string;
    employeeName: string;
    poste: string;
    service: string;
    dateExpiration: string;
    joursRestants: number;
    statut: string;
    organismeFormateur: string;
  }>;
};

const upcomingRenewals = habilitations
  .filter((h) => h.joursRestants <= 60)
  .map((h) => {
    const emp = employees.find((e) => e.id === h.employeeId);
    return { ...h, employee: emp };
  })
  .filter((h) => h.employee !== undefined);

const buildGroups = (items: typeof upcomingRenewals): GroupedRenewal[] => {
  const map = new Map<string, GroupedRenewal>();
  items.forEach((h) => {
    if (!map.has(h.type)) {
      map.set(h.type, { type: h.type, categorie: h.categorie, count: 0, items: [] });
    }
    const g = map.get(h.type)!;
    g.count += 1;
    g.items.push({
      id: h.id,
      employeeId: h.employeeId,
      employeeName: `${h.employee!.prenom} ${h.employee!.nom}`,
      poste: h.employee!.poste,
      service: h.employee!.service,
      dateExpiration: h.dateExpiration,
      joursRestants: h.joursRestants,
      statut: h.statut,
      organismeFormateur: h.organismeFormateur,
    });
  });
  return Array.from(map.values()).sort((a, b) => {
    const minA = Math.min(...a.items.map((i) => i.joursRestants));
    const minB = Math.min(...b.items.map((i) => i.joursRestants));
    return minA - minB;
  });
};

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

export default function RenewalGroupList() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['CACES R489 cat.3', 'Habilitation électrique B2V']));
  const [filterService, setFilterService] = useState('Tous');

  const services = ['Tous', 'Logistique', 'Maintenance', 'Production', 'BTP', 'QSE'];

  const filteredItems = upcomingRenewals.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch = !q || h.type.toLowerCase().includes(q) || h.employee!.nom.toLowerCase().includes(q);
    const matchService = filterService === 'Tous' || h.employee!.service === filterService;
    return matchSearch && matchService;
  });

  const groups = buildGroups(filteredItems);

  const toggleGroup = (type: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleCreateSession = (type: string, count: number) => {
    toast.success(`Session créée pour "${type}" — ${count} participant${count > 1 ? 's' : ''} à convoquer`);
  };

  return (
    <div className="metric-card border shadow-card flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
              <Users size={15} className="text-primary" />
              Renouvellements à venir
              <span className="text-xs font-600 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {upcomingRenewals.length} habilitations
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Groupés par type — idéal pour organiser des sessions collectives
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par type ou salarié..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative">
            <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="pl-7 pr-6 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground"
            >
              {services.map((s) => (
                <option key={`svc-opt-${s}`} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/60">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <CalendarPlus size={32} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-600 text-foreground mb-1">Aucun renouvellement trouvé</p>
            <p className="text-xs text-muted-foreground">Modifiez vos filtres ou la période de recherche</p>
          </div>
        ) : (
          groups.map((group) => {
            const isOpen = expanded.has(group.type);
            const urgentCount = group.items.filter((i) => i.joursRestants <= 15).length;
            const expiredCount = group.items.filter((i) => i.joursRestants < 0).length;

            return (
              <div key={`group-${group.type}`} className="fade-in">
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(group.type)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors text-left group cursor-pointer"
                >
                  <div className={`p-1 rounded transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-700 text-foreground">{group.type}</span>
                      <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full border ${getCategorieColor(group.categorie)}`}>
                        {group.categorie}
                      </span>
                      {expiredCount > 0 && (
                        <span className="text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          {expiredCount} expiré{expiredCount > 1 ? 'es' : 'e'}
                        </span>
                      )}
                      {urgentCount > 0 && expiredCount === 0 && (
                        <span className="text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          {urgentCount} urgent{urgentCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground font-500">{group.count} salarié{group.count > 1 ? 's' : ''}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCreateSession(group.type, group.count); }}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-600 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                    >
                      <CalendarPlus size={11} />
                      Créer session
                    </button>
                  </div>
                </div>

                {/* Group Items */}
                {isOpen && (
                  <div className="bg-muted/20 divide-y divide-border/40">
                    {group.items.map((item) => {
                      const isExpired = item.joursRestants < 0;
                      const isCritical = item.joursRestants >= 0 && item.joursRestants <= 15;

                      return (
                        <div key={`renewal-item-${item.id}`} className="flex items-center gap-4 px-8 py-3 hover:bg-muted/40 transition-colors">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-700 shrink-0">
                            {item.employeeName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-600 text-foreground truncate">{item.employeeName}</p>
                            <p className="text-xs text-muted-foreground truncate">{item.poste} · {item.service}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.dateExpiration).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </p>
                            <p className={`tabular-nums text-xs font-800 ${isExpired ? 'text-red-700' : isCritical ? 'text-amber-700' : 'text-foreground'}`}>
                {isExpired ? `J+${Math.abs(item.joursRestants)}` : `J-${item.joursRestants}`}
                            </p>
                          </div>
                          <StatusBadge statut={item.statut} size="sm" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {groups.length} type{groups.length > 1 ? 's' : ''} d'habilitation · {filteredItems.length} salarié{filteredItems.length > 1 ? 's' : ''} concerné{filteredItems.length > 1 ? 's' : ''}
        </p>
        <button
          onClick={() => toast.success('Planning exporté en PDF')}
          className="text-xs font-600 text-primary hover:underline"
        >
          Exporter la liste →
        </button>
      </div>
    </div>
  );
}