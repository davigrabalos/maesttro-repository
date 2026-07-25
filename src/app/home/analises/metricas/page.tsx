'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { StatCard } from '../../../../components/ui/StatCard';

export default function MetricasPage() {
  return (
    <div>
      <PageHeader 
        title="Métricas de Vendas" 
        description="Acompanhe o desempenho das suas lojas em tempo real." 
      />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard 
          title="Receita Hoje" 
          value="R$ 4.250,00" 
          icon="payments" 
          trend={{ value: 12.5, isPositive: true, text: 'vs ontem' }} 
        />
        <StatCard 
          title="Pedidos Pagos" 
          value="84" 
          icon="shopping_bag" 
          trend={{ value: 5.2, isPositive: true, text: 'vs ontem' }} 
        />
        <StatCard 
          title="Conversão PIX" 
          value="78.5%" 
          icon="pix" 
          color="#10B981"
          trend={{ value: 2.1, isPositive: true }} 
        />
        <StatCard 
          title="Carrinhos Abandonados" 
          value="12" 
          icon="remove_shopping_cart" 
          color="#EF4444"
          trend={{ value: 10, isPositive: false, text: 'vs ontem' }} 
        />
      </div>

      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--md-text-secondary)'
      }}>
        {/* Placeholder para gráfico real no futuro */}
        <div style={{ textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.2 }}>monitoring</span>
          <p style={{ marginTop: '8px' }}>Área reservada para o Gráfico de Receita</p>
        </div>
      </div>
    </div>
  );
}
