'use client';

import React, { useState, useMemo } from 'react';
import { useHomeData, Order } from '../../../../components/home/HomeContext';
import { ProofModal } from '../../../../components/home/ProofModal';

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

export default function PedidosPage() {
  const { storeFilteredOrders, globalSearchText, updateOrderStatus } = useHomeData();
  const [selectedOrderForProof, setSelectedOrderForProof] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterPaidOnly, setFilterPaidOnly] = useState(false);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(true);
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setSelectedOrderForProof(null);
    } else {
      alert('Erro ao atualizar status do pedido.');
    }
    setActionLoading(false);
  };

  const filteredOrders = useMemo(() => {
    let base = storeFilteredOrders;
    if (filterPaidOnly) {
      base = base.filter(o => o.status === 'paid');
    }
    if (!globalSearchText) return base;
    
    const lower = globalSearchText.toLowerCase();
    return base.filter(o =>
      o.customer_email.toLowerCase().includes(lower) ||
      o.status.toLowerCase().includes(lower) ||
      o.payment_method.toLowerCase().includes(lower) ||
      (o.store?.name && o.store.name.toLowerCase().includes(lower))
    );
  }, [storeFilteredOrders, globalSearchText, filterPaidOnly]);

  return (
    <div>
      <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2>Pedidos Recentes & Aprovação</h2>
          <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>
            {filteredOrders.length} pedidos encontrados
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setFilterPaidOnly(!filterPaidOnly)}
            style={{
              padding: '8px 12px',
              backgroundColor: filterPaidOnly ? 'var(--md-primary-light)' : 'transparent',
              color: filterPaidOnly ? 'var(--md-primary)' : 'var(--md-text-secondary)',
              border: `1px solid ${filterPaidOnly ? 'var(--md-primary)' : 'var(--md-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {filterPaidOnly ? 'check_box' : 'check_box_outline_blank'}
            </span>
            Apenas Aprovados
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
                <th>Itens</th>
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
                    <td>
                      {order.order_items && order.order_items.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {order.order_items.map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--md-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                                {item.image_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <span className="material-symbols-outlined" style={{ fontSize: '12px', color: 'var(--md-text-secondary)', display: 'block', padding: '4px' }}>image</span>
                                )}
                              </div>
                              <span style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }} title={item.product_name}>
                                {item.quantity}x {item.product_name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>Nenhum item salvo</span>
                      )}
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
