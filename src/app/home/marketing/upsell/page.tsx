'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function UpsellPage() {
  return (
    <div>
      <PageHeader 
        title="1-Click Upsell" 
        description="Ofereça um produto extra imediatamente após o pagamento aprovado." 
      />
      <EmptyState 
        icon="rocket_launch"
        title="Nenhum Upsell ativo"
        description="Aproveite o momento de compra para vender mais sem precisar que o cliente digite os dados do cartão novamente."
        actionLabel="Criar Funil de Upsell"
        actionHref="#"
      />
    </div>
  );
}
