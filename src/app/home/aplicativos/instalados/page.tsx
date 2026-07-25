'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { DataTable } from '../../../../components/ui/DataTable';
import Link from 'next/link';

const mockApps = [
  { id: '1', name: 'Google Analytics 4', category: 'Tracking', status: 'Instalado' },
  { id: '2', name: 'RD Station Marketing', category: 'CRM', status: 'Instalado' },
];

export default function AplicativosInstaladosPage() {
  return (
    <div>
      <PageHeader 
        title="Aplicativos Instalados" 
        description="Gerencie as integrações ativas no seu painel." 
        action={
          <Link href="/home/aplicativos/loja" style={{
            padding: '8px 16px', backgroundColor: 'var(--md-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>store</span>
            Ir para a Loja
          </Link>
        }
      />

      <DataTable 
        data={mockApps}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'Aplicativo', accessor: (item) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--md-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--md-text-secondary)', fontSize: '24px' }}>extension</span>
              </div>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
            </div>
          ) },
          { header: 'Categoria', accessor: (item) => item.category },
          { header: 'Status', accessor: (item) => (
            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: 'var(--green-light)', color: 'var(--green)' }}>
              {item.status}
            </span>
          ) }
        ]}
      />
    </div>
  );
}
