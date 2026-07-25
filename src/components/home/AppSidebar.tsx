'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useHomeData } from './HomeContext';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

interface NavGroup {
  groupLabel: string;
  groupIcon: string;
  basePath: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'Início',
    groupIcon: 'home',
    basePath: '/home/inicio',
    items: [], // Se vazio, funciona como link direto
  },
  {
    groupLabel: 'Análises',
    groupIcon: 'analytics',
    basePath: '/home/analises',
    items: [
      { id: 'metricas', label: 'Métricas', path: '/home/analises/metricas' },
      { id: 'relatorios', label: 'Relatórios', path: '/home/analises/relatorios' },
      { id: 'ao-vivo', label: 'Ao vivo', path: '/home/analises/ao-vivo' },
    ],
  },
  {
    groupLabel: 'Vendas',
    groupIcon: 'payments',
    basePath: '/home/vendas',
    items: [
      { id: 'pedidos', label: 'Pedidos', path: '/home/vendas/pedidos' },
      { id: 'carrinhos', label: 'Carrinhos abandonados', path: '/home/vendas/carrinhos' },
      { id: 'links', label: 'Links de pagamento', path: '/home/vendas/links' },
    ],
  },
  {
    groupLabel: 'Checkout',
    groupIcon: 'shopping_cart_checkout',
    basePath: '/home/checkout',
    items: [
      { id: 'personalizar', label: 'Personalizar', path: '/home/checkout/personalizar' },
      { id: 'pagamentos', label: 'Formas de pagamentos', path: '/home/checkout/pagamentos' },
      { id: 'regras', label: 'Regras e informações', path: '/home/checkout/regras' },
      { id: 'redirecionamentos', label: 'Redirecionamentos', path: '/home/checkout/redirecionamentos' },
      { id: 'metatags', label: 'Meta tags', path: '/home/checkout/metatags' },
    ],
  },
  {
    groupLabel: 'Produtos',
    groupIcon: 'inventory_2',
    basePath: '/home/produtos',
    items: [
      { id: 'todos', label: 'Ver todos', path: '/home/produtos/todos' },
      { id: 'registrar', label: 'Registrar produto', path: '/home/produtos/registrar' },
      { id: 'botoes', label: 'Botões de compra', path: '/home/produtos/botoes' },
      { id: 'colecoes', label: 'Coleções', path: '/home/produtos/colecoes' },
      { id: 'marcas', label: 'Marcas', path: '/home/produtos/marcas' },
      { id: 'variacoes', label: 'Variações', path: '/home/produtos/variacoes' },
    ],
  },
  {
    groupLabel: 'Clientes',
    groupIcon: 'group',
    basePath: '/home/clientes',
    items: [
      { id: 'todos', label: 'Ver todos', path: '/home/clientes/todos' },
      { id: 'grupos', label: 'Grupos', path: '/home/clientes/grupos' },
      { id: 'leads', label: 'Leads', path: '/home/clientes/leads' },
    ],
  },
  {
    groupLabel: 'Marketing',
    groupIcon: 'campaign',
    basePath: '/home/marketing',
    items: [
      { id: 'cupons', label: 'Cupons', path: '/home/marketing/cupons' },
      { id: 'order-bumps', label: 'Order bumps', path: '/home/marketing/order-bumps' },
      { id: 'faixas', label: 'Faixas de desconto', path: '/home/marketing/faixas' },
      { id: 'pixels', label: 'Pixels', path: '/home/marketing/pixels' },
      { id: 'promocoes', label: 'Promoções', path: '/home/marketing/promocoes' },
      { id: 'upsell', label: 'Upsell', path: '/home/marketing/upsell' },
      { id: 'brindes', label: 'Brindes', path: '/home/marketing/brindes' },
    ],
  },
  {
    groupLabel: 'Aplicativos',
    groupIcon: 'apps',
    basePath: '/home/aplicativos',
    items: [
      { id: 'instalados', label: 'Instalados', path: '/home/aplicativos/instalados' },
      { id: 'loja', label: 'Loja', path: '/home/aplicativos/loja' },
    ],
  },
];

export function AppSidebar() {
  const { stores, selectedStoreId, setSelectedStoreId } = useHomeData();
  const pathname = usePathname();
  const router = useRouter();

  // Auto-expand group based on current URL
  const currentGroup = NAV_GROUPS.find(g => pathname.startsWith(g.basePath))?.groupLabel || 'Início';
  const [openGroup, setOpenGroup] = useState<string>(currentGroup);

  useEffect(() => {
    const matchedGroup = NAV_GROUPS.find(g => pathname.startsWith(g.basePath))?.groupLabel;
    if (matchedGroup && matchedGroup !== openGroup) {
      setOpenGroup(matchedGroup);
    }
  }, [pathname]);

  const handleGroupClick = (group: NavGroup) => {
    if (openGroup === group.groupLabel && group.items.length > 0) {
      setOpenGroup(''); // Toggle off
    } else {
      setOpenGroup(group.groupLabel);
      if (group.items.length > 0) {
        // Redireciona para o primeiro subitem
        router.push(group.items[0].path);
      } else {
        // Redireciona para o basePath
        router.push(group.basePath);
      }
    }
  };

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
          onChange={(e) => setSelectedStoreId(e.target.value)}
        >
          <option value="all">Todas as Lojas (Total)</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name || store.source_id_1}
            </option>
          ))}
        </select>
        <Link 
          href="/home/configuracoes"
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
            textDecoration: 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--md-surface)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
          Nova Loja
        </Link>
      </div>

      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group) => {
          const isOpen = openGroup === group.groupLabel;
          const isActiveGroup = pathname.startsWith(group.basePath);
          return (
            <div key={group.groupLabel} className="sidebar-group" style={{ marginBottom: '8px' }}>
              <button 
                className={`sidebar-group-btn ${isActiveGroup ? 'active' : ''}`}
                onClick={() => handleGroupClick(group)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: isActiveGroup ? 'var(--md-primary-light)' : 'transparent',
                  color: isActiveGroup ? 'var(--md-primary)' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: isActiveGroup ? 600 : 500,
                  transition: 'background-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{group.groupIcon}</span>
                  <span style={{ fontSize: '14px' }}>{group.groupLabel}</span>
                </div>
                {group.items.length > 0 && (
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                )}
              </button>

              {/* Accordion Items */}
              {isOpen && group.items.length > 0 && (
                <div className="sidebar-subitems" style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '26px', marginTop: '4px' }}>
                  {group.items.map((item) => {
                    const isItemActive = pathname === item.path;
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          fontSize: '13px',
                          color: isItemActive ? 'var(--md-primary)' : 'var(--md-text-secondary)',
                          backgroundColor: isItemActive ? 'rgba(37,99,235,0.05)' : 'transparent',
                          fontWeight: isItemActive ? 600 : 400,
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Config & Info */}
      <div style={{ marginTop: 'auto', padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link 
          href="/home/configuracoes" 
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
            color: pathname.startsWith('/home/configuracoes') ? 'var(--md-primary)' : 'var(--text-primary)',
            backgroundColor: pathname.startsWith('/home/configuracoes') ? 'var(--md-primary-light)' : 'transparent',
            borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 500, fontSize: '14px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings</span>
          Configurações
        </Link>
        <div className="sidebar-footer" style={{ borderTop: '1px solid var(--md-border)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', opacity: 0.5 }}>info</span>
          <span className="sidebar-footer-text">Maesttro v2.0</span>
        </div>
      </div>
    </aside>
  );
}
