'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';

export default function PromocoesPage() {
  return (
    <div>
      <PageHeader 
        title="Promoções Agendadas" 
        description="Agende descontos de produtos específicos para datas sazonais." 
      />
      <EmptyState 
        icon="event_available"
        title="Nenhuma promoção agendada"
        description="Crie campanhas como Black Friday ou Natal e os preços mudarão automaticamente."
        actionLabel="Agendar Promoção"
        actionHref="#"
      />
    </div>
  );
}
