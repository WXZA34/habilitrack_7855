import React from 'react';
import ReportsHeader from './ReportsHeader';
import ReportsSummaryKPIs from './ReportsSummaryKPIs';
import ReportsChartsRow from './ReportsChartsRow';
import ComplianceMatrix from './ComplianceMatrix';

export default function ReportsContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <ReportsHeader />
      <div className="flex-1 px-6 lg:px-8 xl:px-10 pb-8 space-y-6">
        <ReportsSummaryKPIs />
        <ReportsChartsRow />
        <ComplianceMatrix />
      </div>
    </div>
  );
}