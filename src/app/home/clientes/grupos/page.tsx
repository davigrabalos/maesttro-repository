'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function GruposPage() {
  return (
    <div>
      <PageHeader 
        title="Grupos de Clientes" 
        description="Segmente seus clientes (VIP, Revendedores, Atacado) para campanhas e descontos específicos." 
      />
      <EmptyState 
        icon="groups"
        title="Nenhum grupo criado"
        description="Crie grupos para atribuir descontos automáticos no checkout."
        actionLabel="Criar Segmento"
        actionHref="#"
      />
    </div>
  );
}
