'use client';

import React, { useState } from 'react';
import { employees } from '@/lib/mockData';
import { MapPin, Users, Plus, Building2, Layers, X, Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface SiteData {
  id: string;
  nom: string;
  ville: string;
  services: string[];
  employeeCount: number;
}

const initialSitesData: SiteData[] = [
  { id: 'site-1', nom: 'Site Bordeaux', ville: 'Bordeaux (33)', services: ['Logistique', 'Maintenance', 'Santé', 'QSE'], employeeCount: 0 },
  { id: 'site-2', nom: 'Site Lyon', ville: 'Lyon (69)', services: ['Production', 'Logistique'], employeeCount: 0 },
  { id: 'site-3', nom: 'Chantier Nord', ville: 'Lille (59)', services: ['BTP'], employeeCount: 0 },
];

const allServices = ['Logistique', 'Maintenance', 'Production', 'BTP', 'Santé', 'QSE'];

const serviceColors: Record<string, string> = {
  Logistique: 'bg-blue-100 text-blue-700 border-blue-200',
  Maintenance: 'bg-purple-100 text-purple-700 border-purple-200',
  Production: 'bg-green-100 text-green-700 border-green-200',
  BTP: 'bg-amber-100 text-amber-700 border-amber-200',
  Santé: 'bg-pink-100 text-pink-700 border-pink-200',
  QSE: 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

interface NewSiteForm {
  nom: string;
  ville: string;
  services: string[];
}

interface NewServiceForm {
  nom: string;
}

export default function SitesTab() {
  const [selectedSite, setSelectedSite] = useState<string | null>('site-1');
  const [sitesData, setSitesData] = useState<SiteData[]>(initialSitesData);
  const [serviceList, setServiceList] = useState<string[]>(allServices);

  const [showNewSite, setShowNewSite] = useState(false);
  const [showNewService, setShowNewService] = useState(false);

  const [newSiteForm, setNewSiteForm] = useState<NewSiteForm>({ nom: '', ville: '', services: [] });
  const [newServiceForm, setNewServiceForm] = useState<NewServiceForm>({ nom: '' });

  const enrichedSites = sitesData.map((site) => ({
    ...site,
    employeeCount: employees.filter((e) => e.site === site.nom).length,
  }));

  const selectedSiteData = enrichedSites.find((s) => s.id === selectedSite);
  const siteEmployees = selectedSiteData
    ? employees.filter((e) => e.site === selectedSiteData.nom)
    : [];

  const serviceStats = serviceList.map((svc) => ({
    name: svc,
    count: employees.filter((e) => e.service === svc).length,
  }));

  const toggleServiceInForm = (svc: string) => {
    setNewSiteForm((prev) => ({
      ...prev,
      services: prev.services.includes(svc)
        ? prev.services.filter((s) => s !== svc)
        : [...prev.services, svc],
    }));
  };

  const handleCreateSite = () => {
    if (!newSiteForm.nom.trim() || !newSiteForm.ville.trim()) {
      toast.error('Veuillez remplir le nom et la ville du site');
      return;
    }
    const newSite: SiteData = {
      id: `site-${Date.now()}`,
      nom: newSiteForm.nom.trim(),
      ville: newSiteForm.ville.trim(),
      services: newSiteForm.services,
      employeeCount: 0,
    };
    setSitesData((prev) => [...prev, newSite]);
    setShowNewSite(false);
    setNewSiteForm({ nom: '', ville: '', services: [] });
    toast.success(`Site "${newSite.nom}" créé avec succès`);
  };

  const handleCreateService = () => {
    if (!newServiceForm.nom.trim()) {
      toast.error('Veuillez saisir un nom de service');
      return;
    }
    const nom = newServiceForm.nom.trim();
    if (serviceList.includes(nom)) {
      toast.error(`Le service "${nom}" existe déjà`);
      return;
    }
    setServiceList((prev) => [...prev, nom]);
    setShowNewService(false);
    setNewServiceForm({ nom: '' });
    toast.success(`Service "${nom}" ajouté avec succès`);
  };

  return (
    <div className="space-y-6">
      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {enrichedSites.map((site) => (
          <button
            key={site.id}
            onClick={() => setSelectedSite(site.id === selectedSite ? null : site.id)}
            className={`metric-card border shadow-card p-5 text-left transition-all duration-150 hover:shadow-modal ${
              selectedSite === site.id ? 'border-primary ring-1 ring-primary/20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 size={18} className="text-primary" />
              </div>
              <span className="text-xs font-600 px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {site.employeeCount} salarié{site.employeeCount > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm font-700 text-foreground mb-0.5">{site.nom}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <MapPin size={11} />
              <span>{site.ville}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {site.services.map((svc) => (
                <span
                  key={svc}
                  className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full border ${serviceColors[svc] || 'bg-muted text-muted-foreground border-border'}`}
                >
                  {svc}
                </span>
              ))}
            </div>
          </button>
        ))}
        <button
          onClick={() => setShowNewSite(true)}
          className="metric-card border border-dashed shadow-card p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors min-h-[140px]"
        >
          <Plus size={20} />
          <span className="text-xs font-600">Ajouter un site</span>
        </button>
      </div>

      {/* Site Detail + Services */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Site Employees */}
        <div className="xl:col-span-2 metric-card border shadow-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
              <Users size={15} className="text-primary" />
              {selectedSiteData ? `Salariés — ${selectedSiteData.nom}` : 'Salariés par site'}
              <span className="text-xs font-600 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {siteEmployees.length}
              </span>
            </h3>
            {selectedSiteData && (
              <button
                onClick={() => toast.info(`Modification du site "${selectedSiteData.nom}"`)}
                className="flex items-center gap-1 text-xs font-600 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil size={12} />
                Modifier
              </button>
            )}
          </div>
          <div className="divide-y divide-border/60">
            {siteEmployees.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-muted-foreground">Sélectionnez un site pour voir ses salariés</p>
              </div>
            ) : (
              siteEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-700 shrink-0">
                    {emp.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-foreground">{emp.prenom} {emp.nom}</p>
                    <p className="text-xs text-muted-foreground">{emp.poste}</p>
                  </div>
                  <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full border ${serviceColors[emp.service] || 'bg-muted text-muted-foreground border-border'}`}>
                    {emp.service}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Services Overview */}
        <div className="metric-card border shadow-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-700 text-foreground flex items-center gap-2">
              <Layers size={15} className="text-primary" />
              Services
            </h3>
            <button
              onClick={() => setShowNewService(true)}
              className="text-xs font-600 text-primary hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Ajouter
            </button>
          </div>
          <div className="divide-y divide-border/60">
            {serviceStats.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${serviceColors[svc.name]?.split(' ')[0] || 'bg-muted'}`} />
                  <span className="text-sm font-500 text-foreground">{svc.name}</span>
                </div>
                <span className="text-xs font-700 text-muted-foreground tabular-nums">
                  {svc.count} salarié{svc.count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Nouveau site */}
      {showNewSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Nouveau site
              </h2>
              <button onClick={() => setShowNewSite(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Nom du site *</label>
                <input type="text" value={newSiteForm.nom} onChange={(e) => setNewSiteForm((p) => ({ ...p, nom: e.target.value }))} placeholder="Site Paris, Chantier Sud..."
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Ville *</label>
                <input type="text" value={newSiteForm.ville} onChange={(e) => setNewSiteForm((p) => ({ ...p, ville: e.target.value }))} placeholder="Paris (75)"
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Services présents</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {serviceList.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => toggleServiceInForm(svc)}
                      className={`text-xs font-600 px-2.5 py-1 rounded-full border transition-all ${
                        newSiteForm.services.includes(svc)
                          ? 'bg-primary text-white border-primary' :'bg-card text-muted-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowNewSite(false)} className="flex-1 btn-secondary text-xs py-2">Annuler</button>
              <button onClick={handleCreateSite} className="flex-1 btn-primary text-xs py-2">Créer le site</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nouveau service */}
      {showNewService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Nouveau service
              </h2>
              <button onClick={() => setShowNewService(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4">
              <label className="text-xs font-600 text-foreground mb-1 block">Nom du service *</label>
              <input type="text" value={newServiceForm.nom} onChange={(e) => setNewServiceForm({ nom: e.target.value })} placeholder="Informatique, RH, Commercial..."
                className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowNewService(false)} className="flex-1 btn-secondary text-xs py-2">Annuler</button>
              <button onClick={handleCreateService} className="flex-1 btn-primary text-xs py-2">Créer le service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
