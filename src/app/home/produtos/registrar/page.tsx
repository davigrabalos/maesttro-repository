'use client';

import React from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import Link from 'next/link';

export default function RegistrarProdutoPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/home/produtos/todos" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--md-text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '13px', marginBottom: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>arrow_back</span>
          Voltar para Produtos
        </Link>
        <PageHeader 
          title="Registrar Novo Produto" 
          description="Preencha os detalhes para cadastrar um produto na sua loja." 
        />
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Detalhes Básicos */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Detalhes Básicos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Nome do Produto</label>
                <input type="text" placeholder="Ex: Tênis Max Air" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Descrição</label>
                <textarea rows={4} placeholder="Descreva os detalhes do produto..." style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)', resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* Precificação */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Precificação</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Preço de Venda</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--md-text-secondary)' }}>R$</span>
                  <input type="number" placeholder="0,00" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Preço Comparativo</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--md-text-secondary)' }}>R$</span>
                  <input type="number" placeholder="0,00" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Lateral de Imagens */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Mídia do Produto</h3>
            <div style={{ 
              border: '2px dashed var(--md-border)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '40px 20px', 
              textAlign: 'center',
              backgroundColor: 'var(--md-surface)',
              cursor: 'pointer'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--md-text-secondary)', marginBottom: '12px' }}>cloud_upload</span>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Clique para fazer upload</p>
              <p style={{ fontSize: '12px', color: 'var(--md-text-secondary)', margin: 0 }}>PNG, JPG ou WEBP (Max 5MB)</p>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Status</h3>
            <select style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }}>
              <option value="active">Ativo (Publicado)</option>
              <option value="draft">Rascunho</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--card-border)' }}>
        <button style={{
          padding: '12px 24px', backgroundColor: 'var(--md-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
          cursor: 'pointer'
        }}>
          Salvar Produto
        </button>
      </div>
    </div>
  );
}
