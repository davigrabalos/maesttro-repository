'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function RedirecionamentosPage() {
  return (
    <div>
      <PageHeader 
        title="Redirecionamentos" 
        description="Mapeie para onde o usuário deve ir após a aprovação ou recusa do pagamento." 
      />
      <EmptyState 
        icon="alt_route"
        title="Nenhum redirecionamento ativo"
        description="Configure páginas de 'Obrigado' personalizadas para Pix, Cartão e Boleto."
        actionLabel="Adicionar Rota"
        actionHref="#"
      />
    </div>
  );
}
