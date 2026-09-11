'use client';

import React, { useState } from 'react';
import { employees as initialEmployees, habilitations as initialHabilitations, Employee, Habilitation } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Filter, UserPlus, ChevronRight, Mail, MapPin, Briefcase, X, ShieldPlus, Pencil } from 'lucide-react';
import { toast } from 'sonner';

const services = ['Tous', 'Logistique', 'Maintenance', 'Production', 'BTP', 'Santé', 'QSE'];
const servicesOptions = ['Logistique', 'Maintenance', 'Production', 'BTP', 'Santé', 'QSE'];
const sites = ['Tous', 'Site Bordeaux', 'Site Lyon', 'Chantier Nord'];
const sitesOptions = ['Site Bordeaux', 'Site Lyon', 'Chantier Nord'];
const habCategories = ['CACES', 'Électrique', 'Sécurité', 'Santé', 'Industrie'];
const organismes = ['AFTRAL', 'AFPA', 'INRS', 'CARSAT', 'OPPBTP', 'INERIS'];

interface NewEmployeeForm {
  nom: string;
  prenom: string;
  poste: string;
  service: string;
  site: string;
  dateEmbauche: string;
}

interface NewHabForm {
  type: string;
  categorie: string;
  numeroCertificat: string;
  dateObtention: string;
  dateExpiration: string;
  organismeFormateur: string;
}

export default function EmployeesTab() {
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState('Tous');
  const [filterSite, setFilterSite] = useState('Tous');
  const [selected, setSelected] = useState<string | null>(null);
  const [employeeList, setEmployeeList] = useState<Employee[]>(initialEmployees);
  const [habList, setHabList] = useState<Habilitation[]>(initialHabilitations);

  const [showNewEmployee, setShowNewEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showAddHab, setShowAddHab] = useState(false);

  const [newEmpForm, setNewEmpForm] = useState<NewEmployeeForm>({
    nom: '', prenom: '', poste: '', service: 'Logistique', site: 'Site Bordeaux', dateEmbauche: '',
  });
  const [editEmpForm, setEditEmpForm] = useState<NewEmployeeForm>({
    nom: '', prenom: '', poste: '', service: 'Logistique', site: 'Site Bordeaux', dateEmbauche: '',
  });
  const [newHabForm, setNewHabForm] = useState<NewHabForm>({
    type: '', categorie: 'CACES', numeroCertificat: '', dateObtention: '', dateExpiration: '', organismeFormateur: 'AFTRAL',
  });

  const filtered = employeeList.filter((emp) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      emp.nom.toLowerCase().includes(q) ||
      emp.prenom.toLowerCase().includes(q) ||
      emp.poste.toLowerCase().includes(q);
    const matchService = filterService === 'Tous' || emp.service === filterService;
    const matchSite = filterSite === 'Tous' || emp.site === filterSite;
    return matchSearch && matchService && matchSite;
  });

  const getEmployeeHabilitations = (empId: string) => habList.filter((h) => h.employeeId === empId);

  const getComplianceColor = (empId: string) => {
    const habs = getEmployeeHabilitations(empId);
    if (habs.some((h) => h.statut === 'Expirée')) return 'text-red-600 bg-red-50 border-red-200';
    if (habs.some((h) => h.statut === 'Critique')) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (habs.some((h) => h.statut === 'À renouveler')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getComplianceLabel = (empId: string) => {
    const habs = getEmployeeHabilitations(empId);
    if (habs.some((h) => h.statut === 'Expirée')) return 'Expirée';
    if (habs.some((h) => h.statut === 'Critique')) return 'Critique';
    if (habs.some((h) => h.statut === 'À renouveler')) return 'À renouveler';
    return 'Conforme';
  };

  const selectedEmployee = selected ? employeeList.find((e) => e.id === selected) : null;
  const selectedHabs = selected ? getEmployeeHabilitations(selected) : [];

  const handleCreateEmployee = () => {
    if (!newEmpForm.nom.trim() || !newEmpForm.prenom.trim() || !newEmpForm.poste.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      nom: newEmpForm.nom.trim(),
      prenom: newEmpForm.prenom.trim(),
      poste: newEmpForm.poste.trim(),
      service: newEmpForm.service,
      site: newEmpForm.site,
      dateEmbauche: newEmpForm.dateEmbauche || new Date().toISOString().split('T')[0],
      avatar: `${newEmpForm.prenom[0] || '?'}${newEmpForm.nom[0] || '?'}`.toUpperCase(),
    };
    setEmployeeList((prev) => [...prev, newEmp]);
    setShowNewEmployee(false);
    setNewEmpForm({ nom: '', prenom: '', poste: '', service: 'Logistique', site: 'Site Bordeaux', dateEmbauche: '' });
    toast.success(`Salarié ${newEmp.prenom} ${newEmp.nom} ajouté avec succès`);
  };

  const handleOpenEdit = () => {
    if (!selectedEmployee) return;
    setEditEmpForm({
      nom: selectedEmployee.nom,
      prenom: selectedEmployee.prenom,
      poste: selectedEmployee.poste,
      service: selectedEmployee.service,
      site: selectedEmployee.site,
      dateEmbauche: selectedEmployee.dateEmbauche,
    });
    setShowEditEmployee(true);
  };

  const handleSaveEdit = () => {
    if (!selected || !editEmpForm.nom.trim() || !editEmpForm.prenom.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setEmployeeList((prev) =>
      prev.map((e) =>
        e.id === selected
          ? { ...e, ...editEmpForm, avatar: `${editEmpForm.prenom[0]}${editEmpForm.nom[0]}`.toUpperCase() }
          : e
      )
    );
    setShowEditEmployee(false);
    toast.success('Informations du salarié mises à jour');
  };

  const handleAddHabilitation = () => {
    if (!selected || !newHabForm.type.trim() || !newHabForm.dateExpiration) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const today = new Date();
    const expDate = new Date(newHabForm.dateExpiration);
    const diffDays = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let statut: Habilitation['statut'] = 'Valide';
    if (diffDays < 0) statut = 'Expirée';
    else if (diffDays <= 15) statut = 'Critique';
    else if (diffDays <= 60) statut = 'À renouveler';

    const newHab: Habilitation = {
      id: `hab-${Date.now()}`,
      employeeId: selected,
      type: newHabForm.type.trim(),
      categorie: newHabForm.categorie,
      numeroCertificat: newHabForm.numeroCertificat.trim() || `CERT-${Date.now()}`,
      dateObtention: newHabForm.dateObtention || new Date().toISOString().split('T')[0],
      dateExpiration: newHabForm.dateExpiration,
      organismeFormateur: newHabForm.organismeFormateur,
      statut,
      joursRestants: diffDays,
    };
    setHabList((prev) => [...prev, newHab]);
    setShowAddHab(false);
    setNewHabForm({ type: '', categorie: 'CACES', numeroCertificat: '', dateObtention: '', dateExpiration: '', organismeFormateur: 'AFTRAL' });
    toast.success(`Habilitation "${newHab.type}" ajoutée pour ${selectedEmployee?.prenom} ${selectedEmployee?.nom}`);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Left: Employee List */}
      <div className="flex-1 min-w-0 metric-card border shadow-card flex flex-col">
        <div className="px-5 py-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-700 text-foreground">
              Salariés
              <span className="ml-2 text-xs font-600 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {filtered.length}
              </span>
            </h3>
            <button onClick={() => setShowNewEmployee(true)} className="btn-primary text-xs py-1.5 px-3">
              <UserPlus size={13} />
              Nouveau salarié
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[160px]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un salarié..."
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
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="relative">
              <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <select
                value={filterSite}
                onChange={(e) => setFilterSite(e.target.value)}
                className="pl-7 pr-6 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground"
              >
                {sites.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/60">
          {filtered.map((emp) => {
            const habs = getEmployeeHabilitations(emp.id);
            const complianceColor = getComplianceColor(emp.id);
            const complianceLabel = getComplianceLabel(emp.id);
            const isSelected = selected === emp.id;
            return (
              <button
                key={emp.id}
                onClick={() => setSelected(isSelected ? null : emp.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/30 ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-700 shrink-0">
                  {emp.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-700 text-foreground">{emp.prenom} {emp.nom}</p>
                  <p className="text-xs text-muted-foreground truncate">{emp.poste} · {emp.service}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{habs.length} hab.</span>
                  <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full border ${complianceColor}`}>
                    {complianceLabel}
                  </span>
                  <ChevronRight size={14} className={`text-muted-foreground transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-600 text-foreground mb-1">Aucun salarié trouvé</p>
              <p className="text-xs text-muted-foreground">Modifiez vos filtres</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Employee Detail Panel */}
      {selectedEmployee ? (
        <div className="w-80 shrink-0 metric-card border shadow-card flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-700">
                {selectedEmployee.avatar}
              </div>
              <div>
                <p className="text-sm font-700 text-foreground">{selectedEmployee.prenom} {selectedEmployee.nom}</p>
                <p className="text-xs text-muted-foreground">{selectedEmployee.poste}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase size={12} className="shrink-0" />
                <span>{selectedEmployee.service}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={12} className="shrink-0" />
                <span>{selectedEmployee.site}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail size={12} className="shrink-0" />
                <span className="lowercase">{selectedEmployee.prenom.toLowerCase()}.{selectedEmployee.nom.toLowerCase()}@entreprise.fr</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-700 text-foreground mb-0.5">Embauche</p>
            <p className="text-xs text-muted-foreground">
              {new Date(selectedEmployee.dateEmbauche).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="px-5 py-3 border-b border-border">
              <p className="text-xs font-700 text-foreground">
                Habilitations
                <span className="ml-1.5 text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {selectedHabs.length}
                </span>
              </p>
            </div>
            <div className="divide-y divide-border/60">
              {selectedHabs.map((hab) => (
                <div key={hab.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-600 text-foreground leading-tight">{hab.type}</p>
                    <StatusBadge statut={hab.statut} size="sm" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{hab.organismeFormateur}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Exp. {new Date(hab.dateExpiration).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    {hab.joursRestants < 0
                      ? <span className="text-red-600 font-700 ml-1">· Expirée</span>
                      : <span className={`font-700 ml-1 ${hab.joursRestants <= 30 ? 'text-amber-600' : 'text-muted-foreground'}`}>· J-{hab.joursRestants}</span>
                    }
                  </p>
                </div>
              ))}
              {selectedHabs.length === 0 && (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-muted-foreground">Aucune habilitation enregistrée</p>
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
              onClick={() => setShowAddHab(true)}
              className="flex-1 btn-primary text-xs py-1.5 flex items-center justify-center gap-1"
            >
              <ShieldPlus size={12} />
              + Habilitation
            </button>
          </div>
        </div>
      ) : (
        <div className="w-80 shrink-0 metric-card border shadow-card flex flex-col items-center justify-center text-center p-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-600 text-foreground mb-1">Sélectionnez un salarié</p>
          <p className="text-xs text-muted-foreground">Cliquez sur un salarié pour voir ses habilitations et ses informations</p>
        </div>
      )}

      {/* Modal: Nouveau salarié */}
      {showNewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <UserPlus size={16} className="text-primary" />
                Nouveau salarié
              </h2>
              <button onClick={() => setShowNewEmployee(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Prénom *</label>
                  <input type="text" value={newEmpForm.prenom} onChange={(e) => setNewEmpForm((p) => ({ ...p, prenom: e.target.value }))} placeholder="Jean"
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Nom *</label>
                  <input type="text" value={newEmpForm.nom} onChange={(e) => setNewEmpForm((p) => ({ ...p, nom: e.target.value }))} placeholder="Dupont"
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Poste *</label>
                <input type="text" value={newEmpForm.poste} onChange={(e) => setNewEmpForm((p) => ({ ...p, poste: e.target.value }))} placeholder="Cariste, Technicien..."
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Service</label>
                  <select value={newEmpForm.service} onChange={(e) => setNewEmpForm((p) => ({ ...p, service: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground">
                    {servicesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Site</label>
                  <select value={newEmpForm.site} onChange={(e) => setNewEmpForm((p) => ({ ...p, site: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground">
                    {sitesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Date d'embauche</label>
                <input type="date" value={newEmpForm.dateEmbauche} onChange={(e) => setNewEmpForm((p) => ({ ...p, dateEmbauche: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground" />
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowNewEmployee(false)} className="flex-1 btn-secondary text-xs py-2">Annuler</button>
              <button onClick={handleCreateEmployee} className="flex-1 btn-primary text-xs py-2">Créer le salarié</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Modifier salarié */}
      {showEditEmployee && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <Pencil size={16} className="text-primary" />
                Modifier — {selectedEmployee.prenom} {selectedEmployee.nom}
              </h2>
              <button onClick={() => setShowEditEmployee(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Prénom *</label>
                  <input type="text" value={editEmpForm.prenom} onChange={(e) => setEditEmpForm((p) => ({ ...p, prenom: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Nom *</label>
                  <input type="text" value={editEmpForm.nom} onChange={(e) => setEditEmpForm((p) => ({ ...p, nom: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Poste *</label>
                <input type="text" value={editEmpForm.poste} onChange={(e) => setEditEmpForm((p) => ({ ...p, poste: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Service</label>
                  <select value={editEmpForm.service} onChange={(e) => setEditEmpForm((p) => ({ ...p, service: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground">
                    {servicesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Site</label>
                  <select value={editEmpForm.site} onChange={(e) => setEditEmpForm((p) => ({ ...p, site: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground">
                    {sitesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Date d'embauche</label>
                <input type="date" value={editEmpForm.dateEmbauche} onChange={(e) => setEditEmpForm((p) => ({ ...p, dateEmbauche: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground" />
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowEditEmployee(false)} className="flex-1 btn-secondary text-xs py-2">Annuler</button>
              <button onClick={handleSaveEdit} className="flex-1 btn-primary text-xs py-2">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ajouter habilitation */}
      {showAddHab && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-modal w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-700 text-foreground flex items-center gap-2">
                <ShieldPlus size={16} className="text-primary" />
                Ajouter une habilitation
              </h2>
              <button onClick={() => setShowAddHab(false)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs text-muted-foreground">Pour : <span className="font-600 text-foreground">{selectedEmployee.prenom} {selectedEmployee.nom}</span></p>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">Type d'habilitation *</label>
                <input type="text" value={newHabForm.type} onChange={(e) => setNewHabForm((p) => ({ ...p, type: e.target.value }))} placeholder="CACES R489 cat.3, Habilitation électrique..."
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Catégorie</label>
                  <select value={newHabForm.categorie} onChange={(e) => setNewHabForm((p) => ({ ...p, categorie: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground">
                    {habCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Organisme</label>
                  <select value={newHabForm.organismeFormateur} onChange={(e) => setNewHabForm((p) => ({ ...p, organismeFormateur: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer text-foreground">
                    {organismes.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-foreground mb-1 block">N° Certificat</label>
                <input type="text" value={newHabForm.numeroCertificat} onChange={(e) => setNewHabForm((p) => ({ ...p, numeroCertificat: e.target.value }))} placeholder="CACES-2026-XXX"
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Date d'obtention</label>
                  <input type="date" value={newHabForm.dateObtention} onChange={(e) => setNewHabForm((p) => ({ ...p, dateObtention: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-600 text-foreground mb-1 block">Date d'expiration *</label>
                  <input type="date" value={newHabForm.dateExpiration} onChange={(e) => setNewHabForm((p) => ({ ...p, dateExpiration: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowAddHab(false)} className="flex-1 btn-secondary text-xs py-2">Annuler</button>
              <button onClick={handleAddHabilitation} className="flex-1 btn-primary text-xs py-2">Ajouter l'habilitation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
