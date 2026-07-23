'use client';

import React, { useState } from 'react';
import { createStore } from '../../app/admin/actions';

export function CreateStoreTab({ onStoreCreated }: { onStoreCreated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      await createStore(formData);
      onStoreCreated();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar loja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-fade-in" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Adicionar Nova Loja</h2>
      <p style={{ color: 'var(--md-text-secondary)', marginBottom: '32px' }}>
        Conecte uma nova loja ao seu Workspace. Os pedidos aparecerão automaticamente no painel.
      </p>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Nome da Loja Fantasia *</label>
          <input 
            name="name" 
            required 
            placeholder="Ex: Minha Loja Oficial"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Source ID (Identificador da Origem) *</label>
          <input 
            name="source_id_1" 
            required 
            placeholder="Ex: shopify_12345 ou minhaloja.myshopify.com"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)' }}
          />
          <p style={{ fontSize: '12px', color: 'var(--md-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
            <strong>O que é o Source ID?</strong> É o código ou URL única que identifica a sua loja na plataforma de origem (como Shopify, Yampi, WooCommerce). 
            Nossos webhooks usam essa informação para saber que o pedido pertence a esta loja. Ex: o final do seu link do Shopify, ou o ID do app fornecido na integração.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Source ID Alternativo (Opcional)</label>
          <input 
            name="source_id_2" 
            placeholder="Ex: outro_token_ou_id"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)' }}
          />
          <p style={{ fontSize: '12px', color: 'var(--md-text-secondary)' }}>
            Se você possui um segundo domínio ou ID apontando para a mesma operação de caixa, insira aqui.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            marginTop: '12px',
            padding: '14px',
            backgroundColor: 'var(--md-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Criando loja...' : 'Concluir Cadastro da Loja'}
        </button>

      </form>
    </div>
  );
}
