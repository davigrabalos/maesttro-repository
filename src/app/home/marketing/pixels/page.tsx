'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function PixelsPage() {
  return (
    <div>
      <PageHeader 
        title="Pixels de Rastreamento" 
        description="Instale o Facebook Pixel, Google Analytics ou Tiktok Pixel no checkout." 
      />
      <EmptyState 
        icon="track_changes"
        title="Nenhum pixel configurado"
        description="Os pixels ajudam a rastrear eventos como PageView e Purchase para otimizar seus anúncios."
        actionLabel="Adicionar Pixel"
        actionHref="#"
      />
    </div>
  );
}
