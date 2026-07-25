'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';

const storeApps = [
  { id: '1', name: 'Facebook Pixel', desc: 'Rastreamento de conversões do Meta Ads.', icon: 'facebook' },
  { id: '2', name: 'Tiktok Pixel', desc: 'Otimização para campanhas no Tiktok.', icon: 'music_note' },
  { id: '3', name: 'Bling ERP', desc: 'Integração completa com notas fiscais e estoque.', icon: 'inventory' },
  { id: '4', name: 'ActiveCampaign', desc: 'Automação de e-mail marketing avançada.', icon: 'mail' },
];

export default function AplicativosLojaPage() {
  return (
    <div>
      <PageHeader 
        title="Loja de Aplicativos" 
        description="Expanda as funcionalidades da sua loja com dezenas de integrações." 
      />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {storeApps.map(app => (
          <div key={app.id} style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: 'var(--md-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--md-primary)' }}>{app.icon}</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{app.name}</h3>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--md-text-secondary)', margin: 0, flex: 1 }}>
              {app.desc}
            </p>
            
            <button style={{
              width: '100%', padding: '10px', backgroundColor: 'var(--md-surface)', color: 'var(--md-primary)',
              border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              marginTop: 'auto'
            }}>
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
