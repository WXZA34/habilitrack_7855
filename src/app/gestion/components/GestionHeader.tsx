import React from 'react';
import { Settings2, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

interface GestionHeaderProps {
  activeTab?: string;
  onAdd?: () => void;
}

export default function GestionHeader({ activeTab, onAdd }: GestionHeaderProps) {
  const handleExport = () => {
    const labels: Record<string, string> = {
      salaries: 'liste des salariés',
      sites: 'liste des sites',
      habilitations: 'types d\'habilitations',
    };
    const label = activeTab ? labels[activeTab] || 'données' : 'données';
    toast.success(`Export de la ${label} en cours…`, {
      description: 'Le fichier CSV sera téléchargé dans quelques instants.',
    });
  };

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    } else {
      toast.info('Utilisez le bouton d\'ajout dans l\'onglet actif');
    }
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-5 border-b border-border bg-card">
      <div className="flex items-start justify-between gap-4 max-w-screen-2xl">
        <div>
          <h1 className="text-2xl font-700 text-foreground tracking-tight flex items-center gap-2.5 mb-1">
            <Settings2 size={22} className="text-primary" />
            Gestion
          </h1>
          <p className="text-sm text-muted-foreground">
            Gérez vos salariés, sites, services et types d'habilitations
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleExport} className="btn-secondary text-xs">
            <Download size={14} />
            Exporter
          </button>
          <button onClick={handleAdd} className="btn-primary text-xs">
            <Plus size={14} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
