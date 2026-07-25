'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { createClient } from '@/utils/supabase/client';
import { useHomeData } from '../../../../components/home/HomeContext';

function ToggleRow({ 
  title, 
  description, 
  active, 
  onToggle 
}: { 
  title: string, 
  description: string, 
  active: boolean, 
  onToggle: (v: boolean) => void 
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--card-border)' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--md-text-secondary)', margin: 0 }}>{description}</p>
      </div>
      <button 
        onClick={() => onToggle(!active)}
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
  const { profile } = useHomeData();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [acceptsPix, setAcceptsPix] = useState(true);
  const [acceptsCard, setAcceptsCard] = useState(true);
  const [acceptsBoleto, setAcceptsBoleto] = useState(false);
  const [maxInstallments, setMaxInstallments] = useState(12);
  const [passInterest, setPassInterest] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!profile?.workspaces?.[0]?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checkout_settings')
        .select('*')
        .eq('workspace_id', profile.workspaces[0].id)
        .single();

      if (data) {
        setAcceptsPix(data.accepts_pix);
        setAcceptsCard(data.accepts_credit_card);
        setAcceptsBoleto(data.accepts_boleto);
        setMaxInstallments(data.max_installments);
        setPassInterest(data.pass_interest);
      }
    } catch (err: any) {
      // Ignore if no row found (it will just use defaults)
      if (err.code !== 'PGRST116') {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [profile, supabase]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const workspaceId = profile?.workspaces?.[0]?.id;
      if (!workspaceId) throw new Error("Workspace não encontrado.");

      const { error } = await supabase.from('checkout_settings').upsert({
        workspace_id: workspaceId,
        accepts_pix: acceptsPix,
        accepts_credit_card: acceptsCard,
        accepts_boleto: acceptsBoleto,
        max_installments: maxInstallments,
        pass_interest: passInterest,
        updated_at: new Date().toISOString()
      }, { onConflict: 'workspace_id' });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Formas de Pagamento" 
        description="Habilite e configure os métodos de pagamento aceitos no seu checkout." 
      />
      
      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, maxWidth: '600px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--green-light)', color: 'var(--green)', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, maxWidth: '600px' }}>
          Configurações salvas com sucesso!
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', color: 'var(--md-text-secondary)', maxWidth: '600px', textAlign: 'center' }}>Carregando preferências...</div>
      ) : (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Métodos Ativos</h3>
          <p style={{ fontSize: '13px', color: 'var(--md-text-secondary)', marginBottom: '16px' }}>O Pix é fortemente recomendado e possui aprovação automática.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ToggleRow 
              title="Pix" 
              description="Aprovação instantânea, taxa reduzida." 
              active={acceptsPix} 
              onToggle={setAcceptsPix} 
            />
            <ToggleRow 
              title="Cartão de Crédito" 
              description="Permitir compras parceladas em até 12x." 
              active={acceptsCard} 
              onToggle={setAcceptsCard} 
            />
            <ToggleRow 
              title="Boleto Bancário" 
              description="Vencimento em 3 dias úteis." 
              active={acceptsBoleto} 
              onToggle={setAcceptsBoleto} 
            />
          </div>

          {acceptsCard && (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Configurações de Parcelamento (Cartão)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Parcelamento Máximo</label>
                  <select 
                    value={maxInstallments} 
                    onChange={e => setMaxInstallments(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }}
                  >
                    <option value="12">12x (Padrão)</option>
                    <option value="6">6x</option>
                    <option value="3">3x</option>
                    <option value="1">Apenas à vista</option>
                  </select>
                </div>
                <ToggleRow 
                  title="Repassar Juros" 
                  description="O cliente assume os juros do parcelamento da operadora." 
                  active={passInterest} 
                  onToggle={setPassInterest} 
                />
              </div>
            </div>
          )}

          <button onClick={handleSave} disabled={saving} style={{
            marginTop: '32px', padding: '12px 24px', backgroundColor: 'var(--md-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', 
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Salvando...' : 'Salvar Preferências'}
          </button>
        </div>
      )}
    </div>
  );
}
