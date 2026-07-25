'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function BotoesPage() {
  return (
    <div>
      <PageHeader 
        title="Botões de Compra" 
        description="Gere botões HTML para incorporar o checkout Maesttro no seu próprio site." 
      />
      <EmptyState 
        icon="smart_button"
        title="Nenhum botão configurado"
        description="Crie seu primeiro botão de compra para vender diretamente das suas Landing Pages."
        actionLabel="Criar Botão"
        actionHref="#"
      />
    </div>
  );
}
