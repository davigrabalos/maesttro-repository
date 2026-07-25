'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function MetatagsPage() {
  return (
    <div>
      <PageHeader 
        title="Meta Tags (SEO)" 
        description="Configure o título e a descrição que aparecem quando você compartilha seu link." 
      />
      <EmptyState 
        icon="tag"
        title="Nenhuma Meta Tag customizada"
        description="Sem meta tags, as redes sociais puxarão informações genéricas do sistema."
        actionLabel="Configurar Tags Globais"
        actionHref="#"
      />
    </div>
  );
}
