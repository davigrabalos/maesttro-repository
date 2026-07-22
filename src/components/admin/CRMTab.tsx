'use client';

import React, { useState } from 'react';

export function CRMTab({ stores }: { stores: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSourceId, setNewSourceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call for now (this would normally hit a Supabase endpoint)
    alert(`Mock: Loja "${newName}" com source_id "${newSourceId}" criada! (Precisa de endpoint no backend)`);
    setIsCreating(false);
    setNewName('');
    setNewSourceId('');
  };

  return (
    <div className="crm-tab">
      <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>CRM White Label (Lojas)</h2>
          <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>Gerencie as frentes de loja cadastradas</span>
        </div>
        <button 
          className="admin-refresh-btn" 
          onClick={() => setIsCreating(!isCreating)}
          style={{ backgroundColor: isCreating ? 'var(--md-border)' : 'var(--md-primary)', color: isCreating ? 'var(--md-text-primary)' : '#fff' }}
        >
          {isCreating ? 'Cancelar' : '+ Nova Loja'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} style={{ 
          padding: '24px', backgroundColor: 'var(--md-surface)', 
          border: '1px solid var(--md-border)', marginBottom: '24px' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '14px' }}>Cadastrar Nova Loja</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>Nome da Loja</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid var(--md-border)', backgroundColor: 'var(--md-background)' }}
                placeholder="Ex: Loja do Instagram"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>Source ID (Link Único)</label>
              <input 
                type="text" 
                value={newSourceId} 
                onChange={e => setNewSourceId(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid var(--md-border)', backgroundColor: 'var(--md-background)' }}
                placeholder="Ex: instaloja"
              />
            </div>
          </div>
          <button type="submit" className="nav-btn-create" style={{ width: '100%', backgroundColor: 'var(--md-primary)', color: '#fff', padding: '12px', border: 'none', fontWeight: 'bold' }}>
            Salvar e Gerar Link
          </button>
        </form>
      )}

      <div className="admin-stores">
        {stores.map((store) => (
          <div key={store.id} className="admin-store-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--md-primary)' }}>storefront</span>
              <span style={{
                fontSize: '10px', padding: '2px 8px',
                backgroundColor: store.active ? '#DCFCE7' : '#FEE2E2',
                color: store.active ? '#15803D' : '#B91C1C',
              }}>
                {store.active ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <h3 style={{ fontSize: '13px', marginBottom: '4px' }}>{store.name}</h3>
            <p style={{ fontSize: '11px', color: 'var(--md-text-secondary)', marginBottom: '12px' }}>
              source: <code style={{ backgroundColor: 'var(--md-border)', padding: '1px 4px' }}>{store.source_id}</code>
            </p>
            <div style={{ borderTop: '1px solid var(--md-border)', paddingTop: '10px' }}>
              <a
                href={`/checkout/demo?source=${store.source_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '11px', color: 'var(--md-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                Abrir link do checkout
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
