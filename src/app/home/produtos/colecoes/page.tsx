'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function ColecoesPage() {
  return (
    <div>
      <PageHeader 
        title="Coleções" 
        description="Agrupe seus produtos em coleções para facilitar a navegação." 
      />
      <EmptyState 
        icon="category"
        title="Nenhuma coleção criada"
        description="As coleções ajudam os clientes a encontrar produtos relacionados mais facilmente."
        actionLabel="Criar Coleção"
        actionHref="#"
      />
    </div>
  );
}
