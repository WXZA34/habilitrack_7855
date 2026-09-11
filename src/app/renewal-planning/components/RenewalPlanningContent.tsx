import React from 'react';
import PlanningHeader from './PlanningHeader';
import ExpirationTimelineChart from './ExpirationTimelineChart';
import RenewalGroupList from './RenewalGroupList';
import SessionCards from './SessionCards';

export default function RenewalPlanningContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <PlanningHeader />
      <div className="flex-1 px-6 lg:px-8 xl:px-10 pb-8 space-y-6">
        <ExpirationTimelineChart />
        <div className="grid grid-cols-1 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 2xl:col-span-3">
            <RenewalGroupList />
          </div>
          <div className="xl:col-span-2 2xl:col-span-2">
            <SessionCards />
          </div>
        </div>
      </div>
    </div>
  );
}