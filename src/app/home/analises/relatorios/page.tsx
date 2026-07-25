'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { DataTable } from '../../../../components/ui/DataTable';

const mockReports = [
  { id: '1', name: 'Conversão Diária', type: 'Vendas', date: 'Hoje', status: 'Processado' },
  { id: '2', name: 'Desempenho de Pix', type: 'Pagamentos', date: 'Ontem', status: 'Processado' },
  { id: '3', name: 'Taxa de Rejeição de Cartões', type: 'Pagamentos', date: 'Últimos 7 dias', status: 'Processado' },
  { id: '4', name: 'Origem de Tráfego', type: 'Marketing', date: 'Este Mês', status: 'Processando...' },
];

export default function RelatoriosPage() {
  return (
    <div>
      <PageHeader 
        title="Relatórios" 
        description="Visualize e exporte relatórios consolidados do seu negócio."
        action={
          <button style={{
            padding: '8px 16px', backgroundColor: 'var(--md-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Exportar CSV
          </button>
        }
      />

      <DataTable 
        data={mockReports}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'Nome do Relatório', accessor: (item) => <span style={{ fontWeight: 500 }}>{item.name}</span> },
          { header: 'Categoria', accessor: (item) => item.type },
          { header: 'Período', accessor: (item) => item.date },
          { header: 'Status', accessor: (item) => (
            <span style={{
              padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
              backgroundColor: item.status === 'Processado' ? 'var(--green-light)' : '#FEF3C7',
              color: item.status === 'Processado' ? 'var(--green)' : '#D97706'
            }}>
              {item.status}
            </span>
          ) }
        ]}
      />
    </div>
  );
}
