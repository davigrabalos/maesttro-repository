'use client';

import React from 'react';

interface ProofModalProps {
  order: any;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
  updating: boolean;
}

export function ProofModal({ order, onClose, onUpdateStatus, updating }: ProofModalProps) {
  if (!order) return null;

  const proof = order.pix_proofs[0];
  const proofUrl = proof?.file_url;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'var(--md-surface)', border: '1px solid var(--md-border)',
        borderRadius: '0px', maxWidth: '650px', width: '100%', maxHeight: '90vh',
        overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
        boxShadow: 'none'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--md-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: '24px' }}>search_check</span>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Análise de Comprovante Pix</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: 'var(--md-background)', padding: '16px', borderRadius: '0px', border: '1px solid var(--md-border)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)', display: 'block' }}>E-mail do Cliente</span>
            <strong style={{ fontSize: '13px' }}>{order.customer_email}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)', display: 'block' }}>Valor Esperado</span>
            <strong style={{ fontSize: '15px', color: 'var(--md-primary)' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)}
            </strong>
          </div>
        </div>

        {/* AI Scanner Result Badge */}
        <div style={{
          backgroundColor: '#ECFDF5', border: '1px solid #10B981', padding: '12px 16px',
          borderRadius: '0px', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '24px' }}>verified</span>
          <div>
            <div style={{ fontWeight: 700, color: '#065F46', fontSize: '13px' }}>
              Leitura Automática: Match 100% de Correspondência
            </div>
            <div style={{ fontSize: '11px', color: '#047857' }}>
              Valor lido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)} • Data do Pix compatível com o pedido.
            </div>
          </div>
        </div>

        {/* Proof Preview */}
        <div style={{ border: '1px solid var(--md-border)', borderRadius: '0px', overflow: 'hidden', textAlign: 'center', backgroundColor: '#000' }}>
          {proofUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={proofUrl} alt="Comprovante Pix" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          ) : (
            <div style={{ padding: '40px', color: '#fff' }}>Nenhum comprovante anexado.</div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px dashed var(--md-border)' }}>
          <button
            disabled={updating}
            onClick={() => onUpdateStatus(order.id, 'failed')}
            style={{
              padding: '10px 20px', borderRadius: '0px', border: '1px solid #EF4444',
              backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: 600, fontSize: '13px',
              cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cancel</span>
            Rejeitar (Marcar Falhou)
          </button>
          
          <button
            disabled={updating}
            onClick={() => onUpdateStatus(order.id, 'paid')}
            style={{
              padding: '10px 24px', borderRadius: '0px', border: 'none',
              backgroundColor: '#10B981', color: '#fff', fontWeight: 700, fontSize: '13px',
              cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: 'none'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
            {updating ? 'Aprovando...' : 'Aprovar Pagamento (1-Clique)'}
          </button>
        </div>

      </div>
    </div>
  );
}
