'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';

export default function PersonalizarPage() {
  return (
    <div>
      <PageHeader 
        title="Personalizar Checkout" 
        description="Altere cores, logo e layout da sua página de pagamento." 
      />
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Identidade Visual</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Cor Primária</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="color" defaultValue="#2563EB" style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  <input type="text" defaultValue="#2563EB" style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Logotipo</label>
                <div style={{ 
                  border: '1px dashed var(--md-border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '24px', 
                  textAlign: 'center',
                  backgroundColor: 'var(--md-surface)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--md-text-secondary)', marginBottom: '8px' }}>image</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>Fazer upload da Logo</p>
                </div>
              </div>
            </div>
            <button style={{
              marginTop: '24px', width: '100%', padding: '12px', backgroundColor: 'var(--md-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
            }}>
              Salvar Alterações
            </button>
          </div>
        </div>

        <div style={{ flex: '2 1 400px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center', opacity: 0.5 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--md-text-secondary)' }}>preview</span>
            <p style={{ marginTop: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>Preview do Checkout em Breve</p>
          </div>
        </div>
      </div>
    </div>
  );
}
