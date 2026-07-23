'use client';

import React, { useState } from 'react';

export function CRMTab({ stores }: { stores: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSourceId1, setNewSourceId1] = useState('');
  const [newSourceId2, setNewSourceId2] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, source_id_1: newSourceId1, source_id_2: newSourceId2 })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Erro ao criar loja.');
        return;
      }
      
      alert(`Loja "${data.store.name}" criada com sucesso! Você pode atualizar a página para que ela apareça na lista.`);
      setIsCreating(false);
      setNewName('');
      setNewSourceId1('');
      setNewSourceId2('');
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
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Integração 1 (Source ID)</label>
              <input 
                type="text" 
                value={newSourceId1} 
                onChange={e => setNewSourceId1(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)' }}
                placeholder="Ex: loja-google"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Integração 2 (Source ID - Opcional)</label>
              <input 
                type="text" 
                value={newSourceId2} 
                onChange={e => setNewSourceId2(e.target.value)} 
                style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)' }}
                placeholder="Ex: loja-facebook"
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Int 1: <code style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)', padding: '1px 4px', borderRadius: 'var(--radius-sm)' }}>{store.source_id_1}</code>
              </p>
              {store.source_id_2 && (
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                  Int 2: <code style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)', padding: '1px 4px', borderRadius: 'var(--radius-sm)' }}>{store.source_id_2}</code>
                </p>
              )}
            </div>
            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href={`/checkout/${store.source_id_1}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '11px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                Abrir Checkout (Integração 1)
              </a>
              {store.source_id_2 && (
                <a
                  href={`/checkout/${store.source_id_2}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '11px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                  Abrir Checkout (Integração 2)
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
