import React from 'react';
import DashboardHeader from './DashboardHeader';
import KPIBentoGrid from './KPIBentoGrid';
import DashboardChartsRow from './DashboardChartsRow';
import AtRiskTable from './AtRiskTable';
import AlertFeed from './AlertFeed';

export default function DashboardPageContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 px-6 lg:px-8 xl:px-10 pb-8 space-y-6">
        <KPIBentoGrid />
        <DashboardChartsRow />
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          <div className="xl:col-span-2 2xl:col-span-3">
            <AtRiskTable />
          </div>
          <div className="xl:col-span-1 2xl:col-span-1">
            <AlertFeed />
          </div>
        </div>
      </div>
    </div>
  );
}