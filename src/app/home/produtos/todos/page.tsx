'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { DataTable } from '../../../../components/ui/DataTable';
import Link from 'next/link';

const mockProducts = [
  { id: '1', name: 'Tênis Esportivo Max', price: 299.90, stock: 45, status: 'Ativo' },
  { id: '2', name: 'Relógio Smart X', price: 499.00, stock: 12, status: 'Ativo' },
  { id: '3', name: 'Fone Bluetooth Noise Cancelling', price: 159.99, stock: 0, status: 'Esgotado' },
  { id: '4', name: 'Mochila Impermeável 30L', price: 120.00, stock: 89, status: 'Ativo' },
  { id: '5', name: 'Garrafa Térmica 1L', price: 85.50, stock: 200, status: 'Inativo' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function ProdutosPage() {
  return (
    <div>
      <PageHeader 
        title="Seus Produtos" 
        description="Gerencie o catálogo de produtos disponíveis no seu checkout."
        action={
          <Link href="/home/produtos/registrar" style={{
            padding: '8px 16px', backgroundColor: 'var(--md-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Novo Produto
          </Link>
        }
      />

      <DataTable 
        data={mockProducts}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'Produto', accessor: (item) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--md-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--md-text-secondary)', fontSize: '20px' }}>image</span>
              </div>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
            </div>
          ) },
          { header: 'Preço', accessor: (item) => <span style={{ fontWeight: 500 }}>{formatCurrency(item.price)}</span> },
          { header: 'Estoque', accessor: (item) => item.stock },
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
