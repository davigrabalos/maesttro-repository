'use client';

import './admin.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ZYFinancasTab } from '../../components/admin/ZYFinancasTab';
import { RankingTab } from '../../components/admin/RankingTab';
import { CRMTab } from '../../components/admin/CRMTab';
import { KeepNotes } from '../../components/admin/KeepNotes';

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
    processing: { label: 'Processando', cls: 'status-processing',  icon: 'sync' },
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

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'zyfinancas' | 'orders' | 'ranking' | 'crm'>('zyfinancas');
  
  // Voice search & filter
  const [filterText, setFilterText] = useState('');
  const [isListening, setIsListening] = useState(false);

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

  // Metrics
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.amount, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const paidCount = orders.filter(o => o.status === 'paid').length;
  const proofCount = orders.reduce((s, o) => s + o.pix_proofs.length, 0);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!filterText) return orders;
    const lower = filterText.toLowerCase();
    return orders.filter(o => 
      o.customer_email.toLowerCase().includes(lower) ||
      o.status.toLowerCase().includes(lower) ||
      o.payment_method.toLowerCase().includes(lower) ||
      (o.store?.name && o.store.name.toLowerCase().includes(lower))
    );
  }, [orders, filterText]);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta pesquisa por voz. Tente usar o Chrome.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFilterText(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="admin-layout">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ICONLOGO.png" alt="Maesttro" style={{ height: '28px', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: '12px', opacity: 0.7, borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '12px' }}>
            Painel Admin Master
          </span>
        </div>
        <div className="admin-navbar-actions">
          <span style={{ fontSize: '11px', opacity: 0.6 }}>
            Atualizado: {formatDate(lastRefresh.toISOString())}
          </span>
          <button className="admin-refresh-btn" onClick={fetchData} disabled={loading}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }}>
              {loading ? 'sync' : 'refresh'}
            </span>
            <span>{loading ? 'Carregando...' : 'Atualizar'}</span>
          </button>
        </div>
      </nav>

      <main className="admin-main">
        {/* Metrics Overview */}
        <div className="admin-metrics">
          <div className="admin-metric-card">
            <div className="admin-metric-label">
              <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>shopping_cart</span>
              Total de Pedidos
            </div>
            <div className="admin-metric-value">{orders.length}</div>
            <div className="admin-metric-sub">{pendingCount} aguardando pagamento</div>
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

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '2px solid var(--md-border)', overflowX: 'auto' }}>
          {([
            ['zyfinancas', 'ZYfinanças', 'monitoring'],
            ['orders', 'Pedidos', 'receipt_long'], 
            ['ranking', 'Ranking', 'emoji_events'],
            ['crm', 'CRM Lojas', 'storefront']
          ] as const).map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === id ? '2px solid var(--md-primary)' : '2px solid transparent',
                marginBottom: '-2px',
                backgroundColor: 'transparent',
                color: activeTab === id ? 'var(--md-primary)' : 'var(--md-text-secondary)',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: activeTab === id ? '700' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'zyfinancas' && <ZYFinancasTab orders={orders} />}
        {activeTab === 'ranking' && <RankingTab orders={orders} />}
        {activeTab === 'crm' && <CRMTab stores={stores} />}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2>Pedidos Recentes</h2>
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
                  style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid var(--md-border)', backgroundColor: 'var(--md-surface)', borderRadius: '4px' }}
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
                      <th>Telefone</th>
                      <th>Loja</th>
                      <th>Valor</th>
                      <th>Método</th>
                      <th>Status</th>
                      <th>Comprovante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--md-text-secondary)' }}>
                          #{order.id.slice(0, 8)}...
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>{order.customer_email}</td>
                        <td>{order.customer_phone}</td>
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
                              <img src="/images/pix.png" alt="Pix" style={{ height: '10px', filter: 'brightness(0) opacity(0.6)' }} />
                            ) : (
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>credit_card</span>
                            )}
                            {order.payment_method === 'pix' ? 'Pix' : 'Cartão'}
                          </span>
                        </td>
                        <td><StatusBadge status={order.status} /></td>
                        <td>
                          {order.pix_proofs.length > 0 ? (
                            <a
                              href={order.pix_proofs[0].file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="proof-link"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                              Ver ({order.pix_proofs.length})
                            </a>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--md-border)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Notes Widget */}
      <KeepNotes />
    </div>
  );
}
