'use client';

import React from 'react';

export interface StoreOption {
  id: string;
  name: string;
  source_id_1: string;
  source_id_2?: string;
}

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
    groupLabel: 'PAINEL',
    groupIcon: 'dashboard',
    items: [
      { id: 'dashboard', label: 'Visão Geral', icon: 'grid_view' },
    ],
  },
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
    groupLabel: 'LOJAS & CRM',
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
  stores: StoreOption[];
  selectedStoreId: string;
  onSelectStore: (storeId: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNotesToggle: () => void;
}

export function AdminSidebar({
  stores,
  selectedStoreId,
  onSelectStore,
  activeTab,
  onTabChange,
  onNotesToggle,
}: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      {/* Top Store Selector */}
      <div className="sidebar-store-selector">
        <label className="sidebar-store-label">
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--md-secondary)' }}>
            storefront
          </span>
          <span>SELETOR DE LOJA</span>
        </label>
        <select
          className="sidebar-store-dropdown"
          value={selectedStoreId}
          onChange={(e) => onSelectStore(e.target.value)}
        >
          <option value="all">Todas as Lojas (Total)</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name || store.source_id_1}
            </option>
          ))}
        </select>
        <button 
          onClick={() => onTabChange('create_store')}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '8px',
            backgroundColor: 'transparent',
            border: '1px dashed var(--md-border)',
            borderRadius: '6px',
            color: 'var(--md-text-primary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--md-surface)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
          Nova Loja
        </button>
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
              >
                <span className="material-symbols-outlined sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer info */}
      <div className="sidebar-footer">
        <span className="material-symbols-outlined" style={{ fontSize: '14px', opacity: 0.5 }}>info</span>
        <span className="sidebar-footer-text">Maesttro v1.0</span>
      </div>
    </aside>
  );
}
