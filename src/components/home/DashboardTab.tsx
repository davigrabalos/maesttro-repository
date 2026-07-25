'use client';

import React from 'react';

export function DashboardTab({ orders }: { orders: any[] }) {
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.amount, 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="dashboard-tab">
      <h1 className="admin-greeting">Olá, Davi!</h1>
      
      {/* Metrics Overview */}
      <div className="admin-metrics-primary">
        <div className="admin-metric-card">
          <div className="admin-metric-value">
            <span className="material-symbols-outlined" style={{ color: 'var(--accent-primary)', fontSize: '12px' }}>circle</span>
            {orders.length * 3}
          </div>
          <div className="admin-metric-label">Visitantes online agora</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-value">
            <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)', fontSize: '20px' }}>payments</span>
            {formatCurrency(totalRevenue)}
            <span className="admin-metric-sub" style={{ color: 'var(--text-primary)' }}>-%▴</span>
          </div>
          <div className="admin-metric-label">Valor em pedidos hoje</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-value">
            <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)', fontSize: '20px' }}>shopping_bag</span>
            {orders.length}
            <span className="admin-metric-sub" style={{ color: 'var(--text-primary)' }}>-%▴</span>
          </div>
          <div className="admin-metric-label">Pedidos hoje</div>
        </div>
      </div>

      <div className="admin-metrics-secondary">
        <div className="admin-metric-card" style={{ padding: '16px' }}>
          <div className="admin-metric-value" style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: 400 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
            {pendingCount}
          </div>
          <div className="admin-metric-label" style={{ fontSize: '11px' }}>Carrinhos para recuperar</div>
        </div>
        <div className="admin-metric-card" style={{ padding: '16px' }}>
          <div className="admin-metric-value" style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: 400 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>schedule</span>
            {pendingCount}
          </div>
          <div className="admin-metric-label" style={{ fontSize: '11px' }}>Pagamentos pendentes</div>
        </div>
        <div className="admin-metric-card" style={{ padding: '16px' }}>
          <div className="admin-metric-value" style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: 400 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>warning</span>
            0
          </div>
          <div className="admin-metric-label" style={{ fontSize: '11px' }}>Falhas em pagamentos</div>
        </div>
        <div className="admin-metric-card" style={{ padding: '16px' }}>
          <div className="admin-metric-value" style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: 400 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>inventory_2</span>
            0
          </div>
          <div className="admin-metric-label" style={{ fontSize: '11px' }}>Com estoque baixo</div>
        </div>
      </div>
    </div>
  );
}
