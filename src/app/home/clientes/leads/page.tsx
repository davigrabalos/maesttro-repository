'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { DataTable } from '../../../../components/ui/DataTable';

const mockLeads = [
  { id: '1', email: 'cliente.abandonou@mail.com', date: 'Hoje', status: 'Frio' },
  { id: '2', email: 'interessado123@teste.com', date: 'Ontem', status: 'Morno' },
  { id: '3', email: 'quase.comprador@exemplo.com', date: 'Há 2 dias', status: 'Quente' },
];

export default function LeadsPage() {
  return (
    <div>
      <PageHeader 
        title="Captação de Leads" 
        description="Pessoas que iniciaram o checkout mas não finalizaram a compra." 
      />
      <DataTable 
        data={mockLeads}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'E-mail do Lead', accessor: (item) => <span style={{ fontWeight: 500 }}>{item.email}</span> },
          { header: 'Data de Captação', accessor: (item) => item.date },
          { header: 'Temperatura', accessor: (item) => {
            let bg = 'var(--md-surface)';
            let color = 'var(--md-text-secondary)';
            if (item.status === 'Frio') { bg = '#DBEAFE'; color = '#1D4ED8'; }
            if (item.status === 'Morno') { bg = '#FEF3C7'; color = '#D97706'; }
            if (item.status === 'Quente') { bg = 'var(--red-light)'; color = 'var(--red)'; }
            return (
              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color: color }}>
                {item.status}
              </span>
            );
          } }
        ]}
      />
    </div>
  );
}
