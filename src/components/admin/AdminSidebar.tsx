'use client';

import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface NavGroup {
  groupLabel: string;
  groupIcon: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'PAGAMENTOS',
    groupIcon: 'payments',
    items: [
      { id: 'orders', label: 'Pedidos', icon: 'receipt_long' },
      { id: 'zyfinancas', label: 'ZYfinanças', icon: 'monitoring' },
      { id: 'approved', label: 'Aprovados', icon: 'task_alt' },
    ],
  },
  {
    groupLabel: 'LOJAS',
    groupIcon: 'storefront',
    items: [
      { id: 'crm', label: 'CRM Lojas', icon: 'storefront' },
      { id: 'ranking', label: 'Ranking', icon: 'emoji_events' },
    ],
  },
  {
    groupLabel: 'FERRAMENTAS',
    groupIcon: 'build',
    items: [
      { id: 'notes', label: 'Anotações', icon: 'sticky_note_2' },
    ],
  },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNotesToggle: () => void;
}

export function AdminSidebar({ activeTab, onTabChange, onNotesToggle }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icon.png" alt="Maesttro" className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">Admin</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupLabel} className="sidebar-group">
            <div className="sidebar-group-label">
              <span className="material-symbols-outlined sidebar-group-icon">{group.groupIcon}</span>
              <span className="sidebar-group-text">{group.groupLabel}</span>
            </div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  if (item.id === 'notes') {
                    onNotesToggle();
                  } else {
                    onTabChange(item.id);
                  }
                }}
                title={item.label}
              >
                <span className="material-symbols-outlined sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Version */}
      <div className="sidebar-footer">
        <span className="material-symbols-outlined" style={{ fontSize: '14px', opacity: 0.5 }}>info</span>
        <span className="sidebar-footer-text">Maesttro v1.0</span>
      </div>
    </aside>
  );
}
