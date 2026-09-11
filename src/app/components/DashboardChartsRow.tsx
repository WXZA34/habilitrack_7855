import React from 'react';
import ComplianceTrendChart from './ComplianceTrendChart';
import ServiceComplianceChart from './ServiceComplianceChart';

export default function DashboardChartsRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-6 max-w-screen-2xl">
      <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-3">
        <ComplianceTrendChart />
      </div>
      <div className="lg:col-span-2 xl:col-span-2 2xl:col-span-2">
        <ServiceComplianceChart />
      </div>
    </div>
  );
}