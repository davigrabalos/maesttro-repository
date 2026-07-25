'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

interface PixProof {
  id: string;
  file_url: string;
  uploaded_at: string;
}

interface Store {
  id: string;
  name: string;
  source_id_1: string;
  source_id_2?: string;
}

export interface Order {
  id: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  store: Store | null;
  pix_proofs: PixProof[];
  order_items?: {
    id: string;
    product_name: string;
    quantity: number;
    total_price: number;
    image_url: string;
  }[];
}

export interface StoreData {
  id: string;
  name: string;
  source_id_1: string;
  source_id_2?: string;
  active: boolean;
  created_at: string;
  orders: { count: number }[];
}

interface HomeContextType {
  orders: Order[];
  stores: StoreData[];
  profile: any;
  loading: boolean;
  lastRefresh: Date;
  selectedStoreId: string;
  setSelectedStoreId: (id: string) => void;
  fetchData: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<boolean>;
  storeFilteredOrders: Order[];
  globalSearchText: string;
  setGlobalSearchText: (text: string) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [globalSearchText, setGlobalSearchText] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, storesRes, profileRes] = await Promise.all([
        fetch('/api/home/orders'),
        fetch('/api/home/stores'),
        fetch('/api/home/profile'),
      ]);
      const ordersData = await ordersRes.json();
      const storesData = await storesRes.json();
      const profileData = await profileRes.json();
      if (ordersData.orders) setOrders(ordersData.orders);
      if (storesData.stores) setStores(storesData.stores);
      if (profileData.user) setProfile(profileData.user);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch home data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/home/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update status', err);
      return false;
    }
  };

  const storeFilteredOrders = useMemo(() => {
    if (selectedStoreId === 'all') return orders;
    return orders.filter(o => o.store?.id === selectedStoreId);
  }, [orders, selectedStoreId]);

  return (
    <HomeContext.Provider value={{
      orders, stores, profile, loading, lastRefresh, 
      selectedStoreId, setSelectedStoreId, fetchData, updateOrderStatus,
      storeFilteredOrders, globalSearchText, setGlobalSearchText
    }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeData() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeData must be used within a HomeProvider');
  }
  return context;
}
