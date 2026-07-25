'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function LinksPage() {
  return (
    <div>
      <PageHeader 
        title="Links de Pagamento" 
        description="Gere links diretos para pagamento via WhatsApp ou Redes Sociais." 
      />
      <EmptyState 
        icon="link"
        title="Nenhum link ativo"
        description="Crie um link de pagamento para vender produtos avulsos sem precisar de uma loja completa."
        actionLabel="Criar Link"
        actionHref="#"
      />
    </div>
  );
}
