'use client';

import React from 'react';
import { useHomeData } from '../../../components/home/HomeContext';
import { CreateStoreTab } from '../../../components/home/CreateStoreTab';
import { useRouter } from 'next/navigation';

export default function ConfiguracoesPage() {
  const { fetchData } = useHomeData();
  const router = useRouter();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Configurações de Lojas</h2>
        <p style={{ fontSize: '14px', color: 'var(--md-text-secondary)', marginTop: '4px' }}>
          Gerencie as integrações e chaves das suas lojas de checkout.
        </p>
      </div>
      <CreateStoreTab onStoreCreated={() => {
        fetchData();
        router.push('/home/inicio');
      }} />
    </div>
  );
}
