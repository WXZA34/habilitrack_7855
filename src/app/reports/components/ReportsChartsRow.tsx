import React from 'react';
import ComplianceHistoryChart from './ComplianceHistoryChart';
import ServiceStackedChart from './ServiceStackedChart';

export default function ReportsChartsRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-6 max-w-screen-2xl">
      <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-3">
        <ComplianceHistoryChart />
      </div>
      <div className="lg:col-span-2 xl:col-span-2 2xl:col-span-2">
        <ServiceStackedChart />
      </div>
    </div>
  );
}