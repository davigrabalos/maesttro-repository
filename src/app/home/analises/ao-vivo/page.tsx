'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';

export default function AoVivoPage() {
  return (
    <div>
      <PageHeader 
        title="Visitantes Ao Vivo" 
        description="Acompanhe quem está no seu checkout neste exato momento." 
      />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Simulação de um "radar" de visitantes */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid rgba(37, 99, 235, 0.5)',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }} />
          <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--md-primary)' }}>14</span>
        </div>
        <h3 style={{ marginTop: '24px', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Visitantes Ativos Agora
        </h3>
        <p style={{ color: 'var(--md-text-secondary)', fontSize: '14px', marginTop: '8px' }}>
          Monitorando tráfego em 2 lojas.
        </p>
      </div>

      {/* Tabela simples mockada */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>Eventos Recentes</h4>
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          {[
            { id: 1, action: 'Iniciou Checkout', time: 'Agora mesmo', loc: 'São Paulo, SP' },
            { id: 2, action: 'Gerou Pix', time: 'Há 2 min', loc: 'Rio de Janeiro, RJ' },
            { id: 3, action: 'Abandonou Carrinho', time: 'Há 5 min', loc: 'Curitiba, PR' },
          ].map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--md-primary)' }}>person</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{e.action}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--md-text-secondary)', display: 'flex', gap: '16px' }}>
                <span>{e.loc}</span>
                <span>{e.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
