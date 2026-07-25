'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { DataTable } from '../../../../components/ui/DataTable';

const mockCarts = [
  { id: '1', email: 'joao.silva@exemplo.com', value: 149.90, time: 'Há 10 min', status: 'Recuperável' },
  { id: '2', email: 'maria.souza@teste.com', value: 299.00, time: 'Há 2 horas', status: 'Enviado E-mail' },
  { id: '3', email: 'carlos.andre@mail.com', value: 50.00, time: 'Há 5 horas', status: 'Convertido' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function CarrinhosPage() {
  return (
    <div>
      <PageHeader 
        title="Carrinhos Abandonados" 
        description="Recupere vendas de clientes que não finalizaram o checkout."
        action={
          <button style={{
            padding: '8px 16px', backgroundColor: 'var(--md-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>forward_to_inbox</span>
            Enviar E-mail em Massa
          </button>
        }
      />
      <DataTable 
        data={mockCarts}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'Cliente (E-mail)', accessor: (item) => <span style={{ fontWeight: 500 }}>{item.email}</span> },
          { header: 'Valor em Carrinho', accessor: (item) => formatCurrency(item.value) },
          { header: 'Tempo de Abandono', accessor: (item) => item.time },
          { header: 'Status', accessor: (item) => {
            let bg = 'var(--md-surface)';
            let color = 'var(--md-text-secondary)';
            if (item.status === 'Recuperável') { bg = '#FEF3C7'; color = '#D97706'; }
            if (item.status === 'Convertido') { bg = 'var(--green-light)'; color = 'var(--green)'; }
            if (item.status === 'Enviado E-mail') { bg = 'var(--md-primary-light)'; color = 'var(--md-primary)'; }
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
