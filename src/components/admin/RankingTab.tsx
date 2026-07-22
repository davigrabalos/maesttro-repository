'use client';

import React from 'react';

export function RankingTab({ orders }: { orders: any[] }) {
  // Aggregate revenue by store
  const storeRevenueMap: Record<string, number> = {};
  orders.forEach(o => {
    if (o.status === 'paid' && o.store) {
      storeRevenueMap[o.store.name] = (storeRevenueMap[o.store.name] || 0) + o.amount;
    }
  });

  const ranking = Object.keys(storeRevenueMap)
    .map(name => ({ name, revenue: storeRevenueMap[name] }))
    .sort((a, b) => b.revenue - a.revenue);

  const getMedalColor = (index: number) => {
    if (index === 0) return '#F59E0B'; // Gold
    if (index === 1) return '#9CA3AF'; // Silver
    if (index === 2) return '#B45309'; // Bronze
    return 'transparent';
  };

  return (
    <div className="ranking-tab">
      <div className="admin-section-header">
        <h2>Ranking de Lojas</h2>
        <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>Top faturamento (apenas pedidos pagos)</span>
      </div>

      <div className="ranking-list">
        {ranking.length === 0 ? (
          <div className="admin-empty">Sem dados de receita ainda.</div>
        ) : (
          ranking.map((store, index) => (
            <div key={store.name} className="ranking-item" style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px', backgroundColor: 'var(--md-surface)',
              border: '1px solid var(--md-border)', marginBottom: '12px'
            }}>
              <div className="ranking-position" style={{ 
                backgroundColor: index < 3 ? getMedalColor(index) : 'var(--md-background)',
                color: index < 3 ? '#fff' : 'var(--md-text-secondary)',
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '0px', fontWeight: '700', fontSize: '14px'
              }}>
                {index + 1}
              </div>
              <div className="ranking-info" style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '15px' }}>{store.name}</h3>
              </div>
              <div className="ranking-revenue" style={{ fontWeight: '700', color: 'var(--md-primary)', fontSize: '16px' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(store.revenue)}
              </div>
              {index === 0 && <span className="material-symbols-outlined" style={{ color: '#F59E0B', fontSize: '24px' }}>emoji_events</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
