'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main
        className={`flex-1 min-w-0 content-transition ${collapsed ? 'ml-16' : 'ml-60'}`}
      >
        {children}
      </main>
    </div>
  );
}