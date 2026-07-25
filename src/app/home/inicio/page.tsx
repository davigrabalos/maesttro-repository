'use client';

import React from 'react';
import { useHomeData } from '../../../components/home/HomeContext';
import { DashboardTab } from '../../../components/home/DashboardTab';

export default function InicioPage() {
  const { storeFilteredOrders } = useHomeData();

  return (
    <div>
      <DashboardTab orders={storeFilteredOrders} />
    </div>
  );
}
