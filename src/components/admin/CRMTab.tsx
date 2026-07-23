'use client';

import React, { useState } from 'react';

export function CRMTab({ stores }: { stores: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSourceId, setNewSourceId] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, source_id: newSourceId })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Erro ao criar loja.');
        return;
      }
      
      alert(`Loja "${data.store.name}" criada com sucesso! Você pode atualizar a página para que ela apareça na lista.`);
      setIsCreating(false);
      setNewName('');
      setNewSourceId('');
    } catch (err) {
      alert('Erro de conexão ao criar loja.');
    } finally {
      setLoading(false);
    }
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
          padding: '24px', backgroundColor: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', marginBottom: '24px' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '14px', color: 'var(--text-primary)' }}>Cadastrar Nova Loja</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Nome da Loja</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)' }}
                placeholder="Ex: Loja do Instagram"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Source ID (Link Único)</label>
              <input 
                type="text" 
                value={newSourceId} 
                onChange={e => setNewSourceId(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)' }}
                placeholder="Ex: instaloja"
              />
            </div>
          </div>
          <button type="submit" className="nav-btn-create" disabled={loading} style={{ width: '100%', backgroundColor: 'var(--accent-primary)', color: '#fff', padding: '12px', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Criando...' : 'Salvar e Gerar Link'}
          </button>
        </form>
      )}

      <div className="admin-stores">
        {stores.map((store) => (
          <div key={store.id} className="admin-store-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--md-primary)' }}>storefront</span>
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                backgroundColor: store.active ? 'var(--green-light)' : 'var(--red-light)',
                color: store.active ? 'var(--green)' : 'var(--red)',
              }}>
                {store.active ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <h3 style={{ fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>{store.name}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              source: <code style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)', padding: '1px 4px', borderRadius: 'var(--radius-sm)' }}>{store.source_id}</code>
            </p>
            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
              <a
                href={`/checkout/demo?source=${store.source_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '11px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
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
