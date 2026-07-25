'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function VariacoesPage() {
  return (
    <div>
      <PageHeader 
        title="Variações" 
        description="Configure tamanhos, cores ou modelos para seus produtos." 
      />
      <EmptyState 
        icon="style"
        title="Nenhuma variação definida"
        description="As variações permitem vender múltiplas opções do mesmo produto (ex: P, M, G)."
        actionLabel="Nova Variação"
        actionHref="#"
      />
    </div>
  );
}
