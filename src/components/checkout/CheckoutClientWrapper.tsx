'use client';

import React, { useState } from 'react';
import { CheckoutForm } from './CheckoutForm';

interface CheckoutClientWrapperProps {
  source: string;
  checkoutId: string;
}

export function CheckoutClientWrapper({ source, checkoutId }: CheckoutClientWrapperProps) {
  const [, setOrderId] = useState<string | null>(null);

  return (
    <CheckoutForm source={source} checkoutId={checkoutId} onOrderCreated={setOrderId} />
  );
}
