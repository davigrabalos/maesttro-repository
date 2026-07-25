'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function FaixasPage() {
  return (
    <div>
      <PageHeader 
        title="Faixas de Desconto" 
        description="Ofereça descontos progressivos por quantidade de itens no carrinho." 
      />
      <EmptyState 
        icon="stacked_bar_chart"
        title="Nenhuma faixa de desconto"
        description="Ex: Compre 2 leve 10% OFF, Compre 3 leve 15% OFF."
        actionLabel="Criar Faixas"
        actionHref="#"
      />
    </div>
  );
}
