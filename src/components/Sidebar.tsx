'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  CalendarClock,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
  Building2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'danger' | 'warning' | 'info';
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: 'group-main',
    label: 'Principal',
    items: [
      { id: 'nav-dashboard', label: 'Tableau de bord', href: '/', icon: LayoutDashboard, badge: 4, badgeVariant: 'danger' },
      { id: 'nav-planning', label: 'Planification', href: '/renewal-planning', icon: CalendarClock, badge: 5, badgeVariant: 'warning' },
      { id: 'nav-reports', label: 'Rapports', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    id: 'group-manage',
    label: 'Gestion',
    items: [
      { id: 'nav-employees', label: 'Salariés', href: '/gestion', icon: Users },
      { id: 'nav-sites', label: 'Sites & Services', href: '/gestion', icon: Building2 },
      { id: 'nav-certifications', label: 'Types d\'habilitations', href: '/gestion', icon: ShieldCheck },
    ],
  },
];

const bottomItems: NavItem[] = [
  { id: 'nav-alerts', label: 'Alertes', href: '#', icon: Bell, badge: 8, badgeVariant: 'danger' },
  { id: 'nav-settings', label: 'Paramètres', href: '#', icon: Settings },
  { id: 'nav-help', label: 'Aide', href: '#', icon: HelpCircle },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getBadgeClass = (variant?: string) => {
    if (variant === 'danger') return 'bg-red-500 text-white';
    if (variant === 'warning') return 'bg-amber-500 text-white';
    return 'bg-primary text-white';
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        bg-card border-r border-border shadow-card
        sidebar-transition
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-border shrink-0 ${collapsed ? 'justify-center px-0 py-4' : 'gap-2.5 px-4 py-4'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-foreground leading-tight truncate">HabiliTrack</span>
            <span className="text-xs text-muted-foreground leading-tight">v2.4.1</span>
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {navGroups.map((group) => (
          <div key={group.id} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground px-2 mb-1.5">
                {group.label}
              </p>
            )}
            {collapsed && <div className="border-t border-border mx-1 mb-2" />}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`
                        group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-500
                        transition-all duration-150
                        ${active
                          ? 'nav-item-active font-600' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!collapsed && item.badge !== undefined && (
                        <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full leading-none ${getBadgeClass(item.badgeVariant)}`}>
                          {item.badge}
                        </span>
                      )}
                      {collapsed && item.badge !== undefined && (
                        <span className={`absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-700 rounded-full leading-none ${getBadgeClass(item.badgeVariant)}`}>
                          {item.badge}
                        </span>
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-card text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-modal">
                          {item.label}
                          {item.badge !== undefined && (
                            <span className={`ml-1.5 text-[10px] px-1 py-0.5 rounded-full ${getBadgeClass(item.badgeVariant)}`}>{item.badge}</span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="border-t border-border px-2 py-2 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-500
                text-muted-foreground hover:bg-muted hover:text-foreground
                transition-all duration-150
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full leading-none ${getBadgeClass(item.badgeVariant)}`}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && (
                <span className={`absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-700 rounded-full leading-none ${getBadgeClass(item.badgeVariant)}`}>
                  {item.badge}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-card text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-modal">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground
            hover:bg-muted hover:text-foreground transition-all duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          aria-label={collapsed ? 'Développer le menu' : 'Réduire le menu'}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="text-sm font-500">Réduire</span></>}
        </button>
      </div>
    </aside>
  );
}