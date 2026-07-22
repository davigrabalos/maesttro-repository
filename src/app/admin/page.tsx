'use client';

import './admin.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ZYFinancasTab } from '../../components/admin/ZYFinancasTab';
import { RankingTab } from '../../components/admin/RankingTab';
import { CRMTab } from '../../components/admin/CRMTab';
import { ProofModal } from '../../components/admin/ProofModal';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

interface PixProof {
  id: string;
  file_url: string;
  uploaded_at: string;
}

interface Store {
  name: string;
  source_id: string;
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
  source_id: string;
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

type TabId = 'orders' | 'approved' | 'zyfinancas' | 'ranking' | 'crm' | 'notes';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [notesOpen, setNotesOpen] = useState(false);
  
  // Voice search & filter
  const [filterText, setFilterText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Modal Proof State
  const [selectedOrderForProof, setSelectedOrderForProof] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, storesRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/stores'),
      ]);
      const ordersData = await ordersRes.json();
      const storesData = await storesRes.json();
      if (ordersData.orders) setOrders(ordersData.orders);
      if (storesData.stores) setStores(storesData.stores);
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

  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.amount, 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const paidCount = orders.filter(o => o.status === 'paid').length;
  const proofCount = orders.reduce((s, o) => s + o.pix_proofs.length, 0);

  const filteredOrders = useMemo(() => {
    const base = activeTab === 'approved'
      ? orders.filter(o => o.status === 'paid')
      : orders;
    if (!filterText) return base;
    const lower = filterText.toLowerCase();
    return base.filter(o =>
      o.customer_email.toLowerCase().includes(lower) ||
      o.status.toLowerCase().includes(lower) ||
      o.payment_method.toLowerCase().includes(lower) ||
      (o.store?.name && o.store.name.toLowerCase().includes(lower))
    );
  }, [orders, filterText, activeTab]);

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
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabId)}
        onNotesToggle={() => window.dispatchEvent(new Event('toggle_global_keep_notes'))}
      />

      {/* Body: Topbar + Main */}
      <div className="admin-body">
        {/* Topbar Fina */}
        <div className="admin-topbar">
          <ThemeToggle />
          <span className="admin-topbar-info">
            Atualizado: {formatDate(lastRefresh.toISOString())}
          </span>
          <button className="admin-refresh-btn" onClick={fetchData} disabled={loading}
            style={{ border: '1px solid var(--md-border)', color: 'var(--md-text-primary)', backgroundColor: 'transparent' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', animation: loading ? 'spin 1s linear infinite' : 'none' }}>
              {loading ? 'sync' : 'refresh'}
            </span>
            <span>{loading ? 'Carregando...' : 'Atualizar'}</span>
          </button>
        </div>

        <main className="admin-main">
          {/* Metrics Overview */}
          <div className="admin-metrics">
            <div className="admin-metric-card">
              <div className="admin-metric-label">
                <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>shopping_cart</span>
                Total de Pedidos
              </div>
              <div className="admin-metric-value">{orders.length}</div>
              <div className="admin-metric-sub">{pendingCount} aguardando/em análise</div>
            </div>
            <div className="admin-metric-card">
              <div className="admin-metric-label">
                <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>payments</span>
                Receita Confirmada
              </div>
              <div className="admin-metric-value" style={{ color: 'var(--md-primary)' }}>{formatCurrency(totalRevenue)}</div>
              <div className="admin-metric-sub">{paidCount} pedidos pagos</div>
            </div>
            <div className="admin-metric-card">
              <div className="admin-metric-label">
                <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>storefront</span>
                Lojas Ativas
              </div>
              <div className="admin-metric-value">{stores.filter(s => s.active).length}</div>
              <div className="admin-metric-sub">{stores.length} total cadastradas</div>
            </div>
            <div className="admin-metric-card">
              <div className="admin-metric-label">
                <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>attach_file</span>
                Comprovantes
              </div>
              <div className="admin-metric-value">{proofCount}</div>
              <div className="admin-metric-sub">enviados pelos clientes</div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'zyfinancas' && <ZYFinancasTab orders={orders} />}
          {activeTab === 'ranking' && <RankingTab orders={orders} />}
          {activeTab === 'crm' && <CRMTab stores={stores} />}

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
                    style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid var(--md-border)', backgroundColor: 'var(--md-surface)', color: 'var(--md-on-surface)', borderRadius: '4px' }}
                  />
                  <button
                    onClick={startVoiceSearch}
                    style={{
                      padding: '8px', backgroundColor: isListening ? '#EF4444' : 'var(--md-surface)',
                      border: '1px solid var(--md-border)', borderRadius: '4px',
                      color: isListening ? '#fff' : 'var(--md-text-secondary)', cursor: 'pointer',
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
                              <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: 'var(--md-primary-light)', color: 'var(--md-primary)' }}>
                                {order.store?.source_id ?? 'N/A'}
                              </span>
                            </td>
                            <td style={{ fontWeight: '700' }}>{formatCurrency(order.amount)}</td>
                            <td>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {order.payment_method === 'pix' ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src="/images/pix.png" alt="Pix" className="pix-icon-img" style={{ height: '10px' }} />
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
                                  padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                                  backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0'
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
                                      padding: '4px 8px', backgroundColor: '#10B981', color: '#fff',
                                      border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
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
                                      padding: '4px 6px', backgroundColor: '#EF4444', color: '#fff',
                                      border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center'
                                    }}
                                    title="Rejeitar"
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
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
  );
}
