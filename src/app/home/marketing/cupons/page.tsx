'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { DataTable } from '../../../../components/ui/DataTable';

const mockCoupons = [
  { id: '1', code: 'BEMVINDO10', type: '10% de desconto', uses: '45/100', status: 'Ativo' },
  { id: '2', code: 'FRETEGRATIS', type: 'Frete Grátis', uses: '12/Ilimitado', status: 'Ativo' },
  { id: '3', code: 'NATAL20', type: '20% de desconto', uses: '150/150', status: 'Esgotado' },
];

export default function CuponsPage() {
  return (
    <div>
      <PageHeader 
        title="Cupons de Desconto" 
        description="Crie e gerencie os códigos promocionais da sua loja." 
        action={
          <button style={{
            padding: '8px 16px', backgroundColor: 'var(--md-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Criar Cupom
          </button>
        }
      />
      <DataTable 
        data={mockCoupons}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'Código', accessor: (item) => <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '14px', backgroundColor: 'var(--md-surface)', padding: '4px 8px', borderRadius: '4px' }}>{item.code}</span> },
          { header: 'Benefício', accessor: (item) => item.type },
          { header: 'Uso', accessor: (item) => item.uses },
          { header: 'Status', accessor: (item) => {
            let bg = 'var(--md-surface)';
            let color = 'var(--md-text-secondary)';
            if (item.status === 'Ativo') { bg = 'var(--green-light)'; color = 'var(--green)'; }
            if (item.status === 'Esgotado') { bg = 'var(--red-light)'; color = 'var(--red)'; }
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
