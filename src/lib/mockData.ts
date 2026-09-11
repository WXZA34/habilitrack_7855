// ── Mock data for HabiliTrack ──────────────────────────────────────────────
// Backend integration point: replace these with API calls to your backend

export type HabilitationStatus = 'Valide' | 'À renouveler' | 'Critique' | 'Expirée' | 'En cours';
export type SessionStatus = 'Planifiée' | 'Confirmée' | 'Terminée' | 'Annulée';

export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
  service: string;
  site: string;
  dateEmbauche: string;
  avatar: string;
}

export interface Habilitation {
  id: string;
  employeeId: string;
  type: string;
  categorie: string;
  numeroCertificat: string;
  dateObtention: string;
  dateExpiration: string;
  organismeFormateur: string;
  statut: HabilitationStatus;
  joursRestants: number;
  documentUrl?: string;
}

export interface AlertItem {
  id: string;
  employeeId: string;
  habilitationId: string;
  employeeName: string;
  habilitationType: string;
  joursRestants: number;
  niveau: 'critique' | 'urgent' | 'planifier';
  dateExpiration: string;
  site: string;
}

export interface TrainingSession {
  id: string;
  type: string;
  dateSession: string;
  organismeFormateur: string;
  lieu: string;
  participants: string[];
  capaciteMax: number;
  statut: SessionStatus;
  cout: number;
}

export interface ComplianceTrendPoint {
  semaine: string;
  taux: number;
  expires: number;
  renouveles: number;
}

export interface ServiceCompliance {
  service: string;
  valide: number;
  aRenouveler: number;
  critique: number;
  expiree: number;
}

export interface MonthlyExpiration {
  mois: string;
  caces: number;
  electrique: number;
  sst: number;
  autres: number;
}

// ── Employees ────────────────────────────────────────────────────────────────
export const employees: Employee[] = [
  { id: 'emp-001', nom: 'Moreau', prenom: 'Thomas', poste: 'Cariste', service: 'Logistique', site: 'Site Bordeaux', dateEmbauche: '2019-03-15', avatar: 'TM' },
  { id: 'emp-002', nom: 'Lefebvre', prenom: 'Sarah', poste: 'Technicienne maintenance', service: 'Maintenance', site: 'Site Bordeaux', dateEmbauche: '2020-07-22', avatar: 'SL' },
  { id: 'emp-003', nom: 'Dubois', prenom: 'Karim', poste: 'Chef d\'équipe', service: 'Production', site: 'Site Lyon', dateEmbauche: '2017-11-08', avatar: 'KD' },
  { id: 'emp-004', nom: 'Martin', prenom: 'Élise', poste: 'Infirmière du travail', service: 'Santé', site: 'Site Bordeaux', dateEmbauche: '2021-02-01', avatar: 'EM' },
  { id: 'emp-005', nom: 'Bernard', prenom: 'Lucas', poste: 'Conducteur d\'engin', service: 'BTP', site: 'Chantier Nord', dateEmbauche: '2018-06-30', avatar: 'LB' },
  { id: 'emp-006', nom: 'Petit', prenom: 'Nadia', poste: 'Cariste', service: 'Logistique', site: 'Site Lyon', dateEmbauche: '2022-01-10', avatar: 'NP' },
  { id: 'emp-007', nom: 'Durand', prenom: 'Alexis', poste: 'Électricien', service: 'Maintenance', site: 'Site Bordeaux', dateEmbauche: '2016-09-14', avatar: 'AD' },
  { id: 'emp-008', nom: 'Girard', prenom: 'Céline', poste: 'Opératrice', service: 'Production', site: 'Site Lyon', dateEmbauche: '2023-04-03', avatar: 'CG' },
  { id: 'emp-009', nom: 'Rousseau', prenom: 'Fabien', poste: 'Grutier', service: 'BTP', site: 'Chantier Nord', dateEmbauche: '2015-12-01', avatar: 'FR' },
  { id: 'emp-010', nom: 'Lambert', prenom: 'Inès', poste: 'Magasinière', service: 'Logistique', site: 'Site Bordeaux', dateEmbauche: '2020-09-17', avatar: 'IL' },
  { id: 'emp-011', nom: 'Fontaine', prenom: 'Romain', poste: 'Technicien process', service: 'Production', site: 'Site Lyon', dateEmbauche: '2019-05-28', avatar: 'RF' },
  { id: 'emp-012', nom: 'Chevalier', prenom: 'Amira', poste: 'Responsable sécurité', service: 'QSE', site: 'Site Bordeaux', dateEmbauche: '2018-02-14', avatar: 'AC' },
];

// ── Habilitations ─────────────────────────────────────────────────────────────
export const habilitations: Habilitation[] = [
  { id: 'hab-001', employeeId: 'emp-001', type: 'CACES R489 cat.3', categorie: 'CACES', numeroCertificat: 'CACES-2024-001', dateObtention: '2024-03-10', dateExpiration: '2026-05-05', organismeFormateur: 'AFTRAL', statut: 'Expirée', joursRestants: -17 },
  { id: 'hab-002', employeeId: 'emp-001', type: 'SST', categorie: 'Sécurité', numeroCertificat: 'SST-2022-089', dateObtention: '2022-06-15', dateExpiration: '2026-06-15', organismeFormateur: 'INRS', statut: 'Valide', joursRestants: 24 },
  { id: 'hab-003', employeeId: 'emp-002', type: 'Habilitation électrique B2V', categorie: 'Électrique', numeroCertificat: 'HE-2023-042', dateObtention: '2023-01-20', dateExpiration: '2026-05-28', organismeFormateur: 'AFPA', statut: 'Critique', joursRestants: 6 },
  { id: 'hab-004', employeeId: 'emp-002', type: 'CACES R486 cat.B', categorie: 'CACES', numeroCertificat: 'CACES-2023-117', dateObtention: '2023-09-05', dateExpiration: '2026-07-10', organismeFormateur: 'AFTRAL', statut: 'Valide', joursRestants: 49 },
  { id: 'hab-005', employeeId: 'emp-003', type: 'Habilitation électrique BC', categorie: 'Électrique', numeroCertificat: 'HE-2024-008', dateObtention: '2024-02-12', dateExpiration: '2026-06-20', organismeFormateur: 'AFPA', statut: 'Valide', joursRestants: 29 },
  { id: 'hab-006', employeeId: 'emp-003', type: 'CACES R489 cat.5', categorie: 'CACES', numeroCertificat: 'CACES-2021-203', dateObtention: '2021-04-18', dateExpiration: '2026-04-18', organismeFormateur: 'AFTRAL', statut: 'Expirée', joursRestants: -34 },
  { id: 'hab-007', employeeId: 'emp-004', type: 'Gestes et Postures', categorie: 'Santé', numeroCertificat: 'GP-2024-055', dateObtention: '2024-01-08', dateExpiration: '2027-01-08', organismeFormateur: 'CARSAT', statut: 'Valide', joursRestants: 231 },
  { id: 'hab-008', employeeId: 'emp-005', type: 'CACES R482 cat.B1', categorie: 'CACES', numeroCertificat: 'CACES-2022-334', dateObtention: '2022-11-14', dateExpiration: '2026-07-22', organismeFormateur: 'AFTRAL', statut: 'Valide', joursRestants: 61 },
  { id: 'hab-009', employeeId: 'emp-005', type: 'Travail en hauteur', categorie: 'Sécurité', numeroCertificat: 'TH-2023-091', dateObtention: '2023-05-22', dateExpiration: '2026-05-22', organismeFormateur: 'OPPBTP', statut: 'Expirée', joursRestants: 0 },
  { id: 'hab-010', employeeId: 'emp-006', type: 'CACES R489 cat.1B', categorie: 'CACES', numeroCertificat: 'CACES-2024-156', dateObtention: '2024-06-01', dateExpiration: '2029-06-01', organismeFormateur: 'AFTRAL', statut: 'Valide', joursRestants: 1106 },
  { id: 'hab-011', employeeId: 'emp-007', type: 'Habilitation électrique B2T', categorie: 'Électrique', numeroCertificat: 'HE-2023-178', dateObtention: '2023-03-30', dateExpiration: '2026-06-08', organismeFormateur: 'AFPA', statut: 'Critique', joursRestants: 17 },
  { id: 'hab-012', employeeId: 'emp-007', type: 'Habilitation électrique H1V', categorie: 'Électrique', numeroCertificat: 'HE-2022-201', dateObtention: '2022-08-15', dateExpiration: '2026-06-30', organismeFormateur: 'AFPA', statut: 'À renouveler', joursRestants: 39 },
  { id: 'hab-013', employeeId: 'emp-008', type: 'SST', categorie: 'Sécurité', numeroCertificat: 'SST-2024-112', dateObtention: '2024-04-10', dateExpiration: '2026-08-10', organismeFormateur: 'INRS', statut: 'Valide', joursRestants: 80 },
  { id: 'hab-014', employeeId: 'emp-009', type: 'CACES R487 cat.1', categorie: 'CACES', numeroCertificat: 'CACES-2023-267', dateObtention: '2023-07-19', dateExpiration: '2026-07-19', organismeFormateur: 'AFTRAL', statut: 'Valide', joursRestants: 58 },
  { id: 'hab-015', employeeId: 'emp-009', type: 'Travail en hauteur', categorie: 'Sécurité', numeroCertificat: 'TH-2024-044', dateObtention: '2024-03-05', dateExpiration: '2026-09-05', organismeFormateur: 'OPPBTP', statut: 'Valide', joursRestants: 106 },
  { id: 'hab-016', employeeId: 'emp-010', type: 'CACES R489 cat.3', categorie: 'CACES', numeroCertificat: 'CACES-2023-388', dateObtention: '2023-10-12', dateExpiration: '2026-06-12', organismeFormateur: 'AFTRAL', statut: 'Critique', joursRestants: 21 },
  { id: 'hab-017', employeeId: 'emp-011', type: 'ATEX Niveau 1', categorie: 'Industrie', numeroCertificat: 'ATEX-2024-019', dateObtention: '2024-02-28', dateExpiration: '2027-02-28', organismeFormateur: 'INERIS', statut: 'Valide', joursRestants: 282 },
  { id: 'hab-018', employeeId: 'emp-012', type: 'SST Formateur', categorie: 'Sécurité', numeroCertificat: 'SSTF-2023-007', dateObtention: '2023-12-01', dateExpiration: '2026-06-25', organismeFormateur: 'INRS', statut: 'À renouveler', joursRestants: 34 },
];

// ── Alerts ────────────────────────────────────────────────────────────────────
export const alerts: AlertItem[] = [
  { id: 'alert-001', employeeId: 'emp-001', habilitationId: 'hab-001', employeeName: 'Thomas Moreau', habilitationType: 'CACES R489 cat.3', joursRestants: -17, niveau: 'critique', dateExpiration: '05/05/2026', site: 'Site Bordeaux' },
  { id: 'alert-002', employeeId: 'emp-006', habilitationId: 'hab-006', employeeName: 'Karim Dubois', habilitationType: 'CACES R489 cat.5', joursRestants: -34, niveau: 'critique', dateExpiration: '18/04/2026', site: 'Site Lyon' },
  { id: 'alert-003', employeeId: 'emp-005', habilitationId: 'hab-009', employeeName: 'Lucas Bernard', habilitationType: 'Travail en hauteur', joursRestants: 0, niveau: 'critique', dateExpiration: '22/05/2026', site: 'Chantier Nord' },
  { id: 'alert-004', employeeId: 'emp-002', habilitationId: 'hab-003', employeeName: 'Sarah Lefebvre', habilitationType: 'Habilitation électrique B2V', joursRestants: 6, niveau: 'critique', dateExpiration: '28/05/2026', site: 'Site Bordeaux' },
  { id: 'alert-005', employeeId: 'emp-007', habilitationId: 'hab-011', employeeName: 'Alexis Durand', habilitationType: 'Habilitation électrique B2T', joursRestants: 17, niveau: 'urgent', dateExpiration: '08/06/2026', site: 'Site Bordeaux' },
  { id: 'alert-006', employeeId: 'emp-010', habilitationId: 'hab-016', employeeName: 'Inès Lambert', habilitationType: 'CACES R489 cat.3', joursRestants: 21, niveau: 'urgent', dateExpiration: '12/06/2026', site: 'Site Bordeaux' },
  { id: 'alert-007', employeeId: 'emp-012', habilitationId: 'hab-018', employeeName: 'Amira Chevalier', habilitationType: 'SST Formateur', joursRestants: 34, niveau: 'planifier', dateExpiration: '25/06/2026', site: 'Site Bordeaux' },
  { id: 'alert-008', employeeId: 'emp-003', habilitationId: 'hab-005', employeeName: 'Karim Dubois', habilitationType: 'Habilitation électrique BC', joursRestants: 29, niveau: 'urgent', dateExpiration: '20/06/2026', site: 'Site Lyon' },
];

// ── Training Sessions ─────────────────────────────────────────────────────────
export const trainingSessions: TrainingSession[] = [
  { id: 'sess-001', type: 'CACES R489 cat.3', dateSession: '2026-06-10', organismeFormateur: 'AFTRAL', lieu: 'Site Bordeaux', participants: ['emp-001', 'emp-010'], capaciteMax: 6, statut: 'Confirmée', cout: 480 },
  { id: 'sess-002', type: 'Habilitation électrique B2V/B2T', dateSession: '2026-06-03', organismeFormateur: 'AFPA', lieu: 'Site Bordeaux', participants: ['emp-002', 'emp-007'], capaciteMax: 8, statut: 'Planifiée', cout: 650 },
  { id: 'sess-003', type: 'Travail en hauteur', dateSession: '2026-06-15', organismeFormateur: 'OPPBTP', lieu: 'Chantier Nord', participants: ['emp-005'], capaciteMax: 10, statut: 'Planifiée', cout: 320 },
  { id: 'sess-004', type: 'SST Recyclage', dateSession: '2026-07-08', organismeFormateur: 'INRS', lieu: 'Site Bordeaux', participants: ['emp-012', 'emp-001'], capaciteMax: 12, statut: 'Planifiée', cout: 280 },
  { id: 'sess-005', type: 'CACES R482 cat.B1', dateSession: '2026-08-20', organismeFormateur: 'AFTRAL', lieu: 'Chantier Nord', participants: ['emp-005', 'emp-009'], capaciteMax: 6, statut: 'Planifiée', cout: 520 },
];

// ── Compliance Trend ──────────────────────────────────────────────────────────
export const complianceTrend: ComplianceTrendPoint[] = [
  { semaine: 'S10', taux: 91, expires: 1, renouveles: 2 },
  { semaine: 'S11', taux: 89, expires: 2, renouveles: 1 },
  { semaine: 'S12', taux: 87, expires: 3, renouveles: 0 },
  { semaine: 'S13', taux: 85, expires: 2, renouveles: 1 },
  { semaine: 'S14', taux: 88, expires: 1, renouveles: 3 },
  { semaine: 'S15', taux: 86, expires: 2, renouveles: 2 },
  { semaine: 'S16', taux: 84, expires: 3, renouveles: 1 },
  { semaine: 'S17', taux: 82, expires: 2, renouveles: 2 },
  { semaine: 'S18', taux: 79, expires: 4, renouveles: 1 },
  { semaine: 'S19', taux: 77, expires: 3, renouveles: 2 },
  { semaine: 'S20', taux: 74, expires: 5, renouveles: 1 },
  { semaine: 'S21', taux: 72, expires: 2, renouveles: 0 },
];

// ── Service Compliance ────────────────────────────────────────────────────────
export const serviceCompliance: ServiceCompliance[] = [
  { service: 'Logistique', valide: 4, aRenouveler: 2, critique: 1, expiree: 2 },
  { service: 'Maintenance', valide: 3, aRenouveler: 1, critique: 2, expiree: 0 },
  { service: 'Production', valide: 3, aRenouveler: 0, critique: 1, expiree: 1 },
  { service: 'BTP', valide: 3, aRenouveler: 0, critique: 0, expiree: 2 },
  { service: 'Santé', valide: 1, aRenouveler: 0, critique: 0, expiree: 0 },
  { service: 'QSE', valide: 0, aRenouveler: 1, critique: 0, expiree: 0 },
];

// ── Monthly Expirations ────────────────────────────────────────────────────────
export const monthlyExpirations: MonthlyExpiration[] = [
  { mois: 'Juin 26', caces: 3, electrique: 2, sst: 1, autres: 1 },
  { mois: 'Juil 26', caces: 2, electrique: 1, sst: 0, autres: 1 },
  { mois: 'Août 26', caces: 1, electrique: 0, sst: 1, autres: 0 },
  { mois: 'Sep 26', caces: 2, electrique: 1, sst: 0, autres: 1 },
  { mois: 'Oct 26', caces: 0, electrique: 2, sst: 1, autres: 0 },
  { mois: 'Nov 26', caces: 3, electrique: 0, sst: 2, autres: 1 },
  { mois: 'Déc 26', caces: 1, electrique: 1, sst: 0, autres: 2 },
  { mois: 'Jan 27', caces: 2, electrique: 0, sst: 1, autres: 0 },
  { mois: 'Fév 27', caces: 0, electrique: 3, sst: 0, autres: 1 },
  { mois: 'Mar 27', caces: 1, electrique: 1, sst: 1, autres: 0 },
  { mois: 'Avr 27', caces: 2, electrique: 0, sst: 0, autres: 1 },
  { mois: 'Mai 27', caces: 1, electrique: 2, sst: 1, autres: 0 },
];

// ── Compliance History (for Reports) ─────────────────────────────────────────
export const complianceHistory = [
  { mois: 'Déc 25', taux: 94, valide: 17, expirees: 1 },
  { mois: 'Jan 26', taux: 92, valide: 16, expirees: 2 },
  { mois: 'Fév 26', taux: 90, valide: 16, expirees: 2 },
  { mois: 'Mar 26', taux: 88, valide: 15, expirees: 3 },
  { mois: 'Avr 26', taux: 83, valide: 15, expirees: 3 },
  { mois: 'Mai 26', taux: 72, valide: 13, expirees: 5 },
];

// ── Certification Types ────────────────────────────────────────────────────────
export const certificationTypes = [
  { id: 'cert-caces', label: 'CACES', color: '#1D4ED8' },
  { id: 'cert-electrique', label: 'Électrique', color: '#7C3AED' },
  { id: 'cert-sst', label: 'SST', color: '#16A34A' },
  { id: 'cert-hauteur', label: 'Travail en hauteur', color: '#D97706' },
  { id: 'cert-industrie', label: 'Industrie', color: '#0369A1' },
  { id: 'cert-sante', label: 'Santé', color: '#BE185D' },
];