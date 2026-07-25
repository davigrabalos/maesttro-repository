'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function RegrasPage() {
  return (
    <div>
      <PageHeader 
        title="Regras e Informações" 
        description="Defina regras de negócio, bloqueios e informações extras do checkout." 
      />
      <EmptyState 
        icon="gavel"
        title="Nenhuma regra configurada"
        description="Adicione regras para bloquear determinados IPs, exigir CPF/CNPJ específicos ou adicionar avisos."
        actionLabel="Nova Regra"
        actionHref="#"
      />
    </div>
  );
}
