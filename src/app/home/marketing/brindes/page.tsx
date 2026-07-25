'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function BrindesPage() {
  return (
    <div>
      <PageHeader 
        title="Brindes e Presentes" 
        description="Configure brindes automáticos ao atingir determinado valor de compra." 
      />
      <EmptyState 
        icon="redeem"
        title="Nenhum brinde configurado"
        description="Oferecer brindes é uma excelente estratégia para aumentar o ticket médio e a conversão."
        actionLabel="Adicionar Brinde"
        actionHref="#"
      />
    </div>
  );
}
