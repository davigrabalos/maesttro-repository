'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function OrderBumpsPage() {
  return (
    <div>
      <PageHeader 
        title="Order Bumps" 
        description="Ofereça produtos complementares no momento do pagamento com 1 clique." 
      />
      <EmptyState 
        icon="add_shopping_cart"
        title="Nenhum Order Bump ativo"
        description="Aumente seu Ticket Médio oferecendo produtos adicionais no checkout."
        actionLabel="Criar Oferta"
        actionHref="#"
      />
    </div>
  );
}
