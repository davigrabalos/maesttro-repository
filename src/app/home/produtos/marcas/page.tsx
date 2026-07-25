'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function MarcasPage() {
  return (
    <div>
      <PageHeader 
        title="Marcas" 
        description="Gerencie as marcas dos seus produtos vendidos." 
      />
      <EmptyState 
        icon="branding_watermark"
        title="Nenhuma marca cadastrada"
        description="Associe seus produtos a marcas para organizar seu catálogo."
        actionLabel="Adicionar Marca"
        actionHref="#"
      />
    </div>
  );
}
