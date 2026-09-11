'use client';

import React, { useState } from 'react';
import GestionHeader from './GestionHeader';
import EmployeesTab from './EmployeesTab';
import SitesTab from './SitesTab';
import CertTypesTab from './CertTypesTab';

export type GestionTab = 'salaries' | 'sites' | 'habilitations';

export default function GestionContent() {
  const [activeTab, setActiveTab] = useState<GestionTab>('salaries');

  const tabs: { key: GestionTab; label: string }[] = [
    { key: 'salaries', label: 'Salariés' },
    { key: 'sites', label: 'Sites & Services' },
    { key: 'habilitations', label: "Types d'habilitations" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <GestionHeader activeTab={activeTab} />
      {/* Tab Bar */}
      <div className="px-6 lg:px-8 xl:px-10 border-b border-border bg-card">
        <div className="flex gap-0 max-w-screen-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-600 border-b-2 transition-all duration-150 ${
                activeTab === tab.key
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl w-full">
        {activeTab === 'salaries' && <EmployeesTab />}
        {activeTab === 'sites' && <SitesTab />}
        {activeTab === 'habilitations' && <CertTypesTab />}
      </div>
    </div>
  );
}
