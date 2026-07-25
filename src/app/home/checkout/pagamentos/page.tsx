'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';

function ToggleRow({ title, description, initiallyActive = false }: { title: string, description: string, initiallyActive?: boolean }) {
  const [active, setActive] = useState(initiallyActive);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--card-border)' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--md-text-secondary)', margin: 0 }}>{description}</p>
      </div>
      <button 
        onClick={() => setActive(!active)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', 
          backgroundColor: active ? 'var(--green)' : 'var(--md-border)',
          border: 'none', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
          position: 'absolute', top: '2px', left: active ? '22px' : '2px', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }} />
      </button>
    </div>
  );
}

export default function PagamentosPage() {
  return (
    <div>
      <PageHeader 
        title="Formas de Pagamento" 
        description="Habilite e configure os métodos de pagamento aceitos no seu checkout." 
      />
      
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Métodos Ativos</h3>
        <p style={{ fontSize: '13px', color: 'var(--md-text-secondary)', marginBottom: '16px' }}>OPix é obrigatório e possui aprovação automática nativa.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ToggleRow title="Pix" description="Aprovação instantânea, taxa reduzida." initiallyActive={true} />
          <ToggleRow title="Cartão de Crédito" description="Permitir compras parceladas em até 12x." initiallyActive={true} />
          <ToggleRow title="Boleto Bancário" description="Vencimento em 3 dias úteis." initiallyActive={false} />
        </div>

        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Configurações de Parcelamento (Cartão)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Parcelamento Máximo</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }}>
                <option value="12">12x (Padrão)</option>
                <option value="6">6x</option>
                <option value="3">3x</option>
                <option value="1">Apenas à vista</option>
              </select>
            </div>
            <ToggleRow title="Repassar Juros" description="O cliente assume os juros do parcelamento da operadora." initiallyActive={false} />
          </div>
        </div>

        <button style={{
          marginTop: '32px', padding: '12px 24px', backgroundColor: 'var(--md-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
        }}>
          Salvar Preferências
        </button>
      </div>
    </div>
  );
}
