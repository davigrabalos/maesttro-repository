'use client';

import React from 'react';
import { useHomeData } from '../../../../components/home/HomeContext';
import { CRMTab } from '../../../../components/home/CRMTab';

export default function ClientesPage() {
  const { stores } = useHomeData();

  return (
    <div>
      <CRMTab stores={stores} />
    </div>
  );
}
