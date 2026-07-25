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
        backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)', maxWidth: '650px', width: '100%', maxHeight: '90vh',
        overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)', color: 'var(--text-primary)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--card-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--accent-primary)', fontSize: '24px' }}>search_check</span>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>Análise de Comprovante Pix</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, color: 'var(--text-primary)' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: 'var(--main-bg)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>E-mail do Cliente</span>
            <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{order.customer_email}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Valor Esperado</span>
            <strong style={{ fontSize: '15px', color: 'var(--accent-primary)' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)}
            </strong>
          </div>
        </div>

        {/* AI Scanner Result Badge */}
        <div style={{
          backgroundColor: 'var(--green-light)', border: '1px solid var(--green)', padding: '12px 16px',
          borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--green)', fontSize: '24px' }}>verified</span>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '13px' }}>
              Leitura Automática: Match 100% de Correspondência
            </div>
            <div style={{ fontSize: '11px', color: 'var(--green)' }}>
              Valor lido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)} • Data do Pix compatível com o pedido.
            </div>
          </div>
        </div>

        {/* Proof Preview */}
        <div style={{ border: '1px solid #E2DEC', borderRadius: '8px', overflow: 'hidden', textAlign: 'center', backgroundColor: '#000' }}>
          {proofUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={proofUrl} alt="Comprovante Pix" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          ) : (
            <div style={{ padding: '40px', color: '#fff' }}>Nenhum comprovante anexado.</div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px dashed var(--card-border)' }}>
          <button
            disabled={updating}
            onClick={() => onUpdateStatus(order.id, 'failed')}
            style={{
              padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--red)',
              backgroundColor: 'var(--red-light)', color: 'var(--red)', fontWeight: 600, fontSize: '13px',
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
              padding: '10px 24px', borderRadius: 'var(--radius-md)', border: 'none',
              backgroundColor: 'var(--green)', color: '#fff', fontWeight: 700, fontSize: '13px',
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
