'use client';

import React from 'react';
import { useHomeData } from '../../../../components/home/HomeContext';
import { RankingTab } from '../../../../components/home/RankingTab';

export default function RankingPage() {
  const { orders } = useHomeData();

  return (
    <div>
      <RankingTab orders={orders} />
    </div>
  );
}
