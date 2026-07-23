'use client';

import './admin.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ZYFinancasTab } from '../../components/admin/ZYFinancasTab';
import { RankingTab } from '../../components/admin/RankingTab';
import { CRMTab } from '../../components/admin/CRMTab';
import { ProofModal } from '../../components/admin/ProofModal';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardTab } from '../../components/admin/DashboardTab';
import { CreateStoreTab } from '../../components/admin/CreateStoreTab';

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

interface Order {
  id: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  store: Store | null;
  pix_proofs: PixProof[];
}

interface StoreData {
  id: string;
  name: string;
  source_id_1: string;
  source_id_2?: string;
  active: boolean;
  created_at: string;
  orders: { count: number }[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: string }> = {
    pending:    { label: 'Aguardando',  cls: 'status-pending',    icon: 'hourglass_empty' },
    processing: { label: 'Em Análise',  cls: 'status-processing',  icon: 'sync' },
    paid:       { label: 'Pago',        cls: 'status-paid',        icon: 'check_circle' },
    failed:     { label: 'Falhou',      cls: 'status-failed',      icon: 'cancel' },
  };
  const s = map[status] ?? { label: status, cls: 'status-pending', icon: 'info' };
  return (
    <span className={`status-badge ${s.cls}`}>
      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

export type TabId = 'dashboard' | 'orders' | 'approved' | 'zyfinancas' | 'ranking' | 'crm' | 'create_store' | 'notes';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [notesOpen, setNotesOpen] = useState(false);
  
  // Voice search & filter
  const [filterText, setFilterText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Store selector filter state
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');

  // Modal Proof State
  const [selectedOrderForProof, setSelectedOrderForProof] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, storesRes, profileRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/stores'),
        fetch('/api/admin/profile'),
      ]);
      const ordersData = await ordersRes.json();
      const storesData = await storesRes.json();
      const profileData = await profileRes.json();
      if (ordersData.orders) setOrders(ordersData.orders);
      if (storesData.stores) setStores(storesData.stores);
      if (profileData.user) setProfile(profileData.user);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setSelectedOrderForProof(null);
      } else {
        alert('Erro ao atualizar status do pedido.');
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Erro de conexão ao atualizar status.');
    } finally {
      setActionLoading(false);
    }
  };

  const storeFilteredOrders = useMemo(() => {
    if (selectedStoreId === 'all') return orders;
    return orders.filter(o => o.store?.id === selectedStoreId);
  }, [orders, selectedStoreId]);

  const proofCount = storeFilteredOrders.reduce((s, o) => s + o.pix_proofs.length, 0);

  const filteredOrders = useMemo(() => {
    const base = activeTab === 'approved'
      ? storeFilteredOrders.filter(o => o.status === 'paid')
      : storeFilteredOrders;
    if (!filterText) return base;
    const lower = filterText.toLowerCase();
    return base.filter(o =>
      o.customer_email.toLowerCase().includes(lower) ||
      o.status.toLowerCase().includes(lower) ||
      o.payment_method.toLowerCase().includes(lower) ||
      (o.store?.name && o.store.name.toLowerCase().includes(lower))
    );
  }, [storeFilteredOrders, filterText, activeTab]);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta pesquisa por voz. Tente usar o Chrome.');
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setFilterText(event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const showOrdersTable = activeTab === 'orders' || activeTab === 'approved';

  return (
    <div className="admin-layout">
      {/* Red Top Navbar */}
      <AdminHeader
        filterText={filterText}
        onFilterChange={setFilterText}
        isListening={isListening}
        onVoiceSearch={startVoiceSearch}
        lastRefresh={lastRefresh}
        onRefresh={fetchData}
        loading={loading}
        orders={orders}
        profile={profile}
      />

      <div className="admin-container">
        {/* Fixed Sidebar with Store Selector */}
        <AdminSidebar
          stores={stores}
          selectedStoreId={selectedStoreId}
          onSelectStore={setSelectedStoreId}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabId)}
          onNotesToggle={() => window.dispatchEvent(new Event('toggle_global_keep_notes'))}
        />

        {/* Body Main */}
        <div className="admin-body">

        <main className="admin-main">
          {/* Tab Content */}
          {activeTab === 'dashboard' && <DashboardTab orders={storeFilteredOrders} />}
          {activeTab === 'zyfinancas' && <ZYFinancasTab orders={storeFilteredOrders} />}
          {activeTab === 'ranking' && <RankingTab orders={orders} />}
          {activeTab === 'crm' && <CRMTab stores={stores} />}
          {activeTab === 'create_store' && (
            <CreateStoreTab onStoreCreated={() => {
              fetchData();
              setActiveTab('dashboard');
            }} />
          )}

          {/* Orders / Approved Table */}
          {showOrdersTable && (
            <div>
              <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2>{activeTab === 'approved' ? 'Pagamentos Aprovados' : 'Pedidos Recentes & Aprovação'}</h2>
                  <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>
                    {filteredOrders.length} pedidos encontrados
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      placeholder="Pesquisar (Pix, e-mail...)"
                      style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)' }}
                    />
                    <button
                      onClick={startVoiceSearch}
                      style={{
                        padding: '8px', backgroundColor: isListening ? '#EF4444' : 'var(--card-bg)',
                        border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)',
                        color: isListening ? '#fff' : 'var(--text-primary)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center'
                      }}
                      title="Pesquisa por voz"
                    >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', animation: isListening ? 'pulse 1s infinite' : 'none' }}>mic</span>
                  </button>
                </div>
              </div>

              <div className="admin-table-wrapper">
                {filteredOrders.length === 0 ? (
                  <div className="admin-empty">
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '12px', opacity: 0.4 }}>search_off</span>
                    Nenhum pedido encontrado.
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>E-mail</th>
                        <th>Loja</th>
                        <th>Valor</th>
                        <th>Método</th>
                        <th>Status</th>
                        <th>Análise Auto</th>
                        <th>Comprovante</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const hasProof = order.pix_proofs.length > 0;
                        return (
                          <tr key={order.id}>
                            <td style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--md-text-secondary)' }}>
                              #{order.id.slice(0, 8)}...
                            </td>
                            <td>{formatDate(order.created_at)}</td>
                            <td>{order.customer_email}</td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: 'var(--md-primary-light)', color: 'var(--md-primary)', display: 'inline-block', width: 'fit-content' }}>
                                  {order.store?.source_id_1 ?? 'N/A'}
                                </span>
                                {order.store?.source_id_2 && (
                                  <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: 'var(--md-primary-light)', color: 'var(--md-primary)', display: 'inline-block', width: 'fit-content' }}>
                                    {order.store.source_id_2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ fontWeight: '700' }}>{formatCurrency(order.amount)}</td>
                            <td>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {order.payment_method === 'pix' ? (
                                  <span className="pix-icon-img" />
                                ) : (
                                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>credit_card</span>
                                )}
                                {order.payment_method === 'pix' ? 'Pix' : 'Cartão'}
                              </span>
                            </td>
                            <td><StatusBadge status={order.status} /></td>
                            <td>
                              {hasProof ? (
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                                  padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 700,
                                  backgroundColor: 'var(--green-light)', color: 'var(--green)', border: '1px solid rgba(22, 163, 74, 0.3)'
                                }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
                                  Match 100%
                                </span>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>—</span>
                              )}
                            </td>
                            <td>
                              {hasProof ? (
                                <button
                                  onClick={() => setSelectedOrderForProof(order)}
                                  style={{
                                    background: 'none', border: 'none', color: 'var(--md-primary)',
                                    fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex',
                                    alignItems: 'center', gap: '4px', textDecoration: 'underline'
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                                  Inspecionar
                                </button>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--md-border)' }}>Pendente</span>
                              )}
                            </td>
                            <td>
                              {order.status !== 'paid' ? (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(order.id, 'paid')}
                                    style={{
                                      padding: '4px 8px', backgroundColor: 'var(--green)', color: '#fff',
                                      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700,
                                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px'
                                    }}
                                    title="Aprovar"
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check</span>
                                    Aprovar
                                  </button>
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(order.id, 'failed')}
                                    style={{
                                      padding: '4px 6px', backgroundColor: 'var(--red)', color: '#fff',
                                      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700,
                                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center'
                                    }}
                                    title="Rejeitar"
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>done_all</span>
                                  Concluído
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Proof Modal */}
      {selectedOrderForProof && (
        <ProofModal
          order={selectedOrderForProof}
          onClose={() => setSelectedOrderForProof(null)}
          onUpdateStatus={handleUpdateStatus}
          updating={actionLoading}
        />
      )}
    </div>
    </div>
  );
}
