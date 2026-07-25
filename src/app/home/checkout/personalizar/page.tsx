'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { createClient } from '@/utils/supabase/client';
import { useHomeData } from '../../../../components/home/HomeContext';

export default function PersonalizarPage() {
  const { profile } = useHomeData();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [logoUrl, setLogoUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!profile?.workspaces?.[0]?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checkout_settings')
        .select('primary_color, logo_url')
        .eq('workspace_id', profile.workspaces[0].id)
        .single();

      if (data) {
        if (data.primary_color) setPrimaryColor(data.primary_color);
        if (data.logo_url) setLogoUrl(data.logo_url);
      }
    } catch (err: any) {
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
        primary_color: primaryColor,
        logo_url: logoUrl,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const workspaceId = profile?.workspaces?.[0]?.id;
    if (!workspaceId) {
      setError("Workspace não encontrado para upload.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${workspaceId}/logo-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('store-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('store-assets')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao subir imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Personalizar Checkout" 
        description="Altere cores, logo e layout da sua página de pagamento." 
      />
      
      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, maxWidth: '800px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--green-light)', color: 'var(--green)', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, maxWidth: '800px' }}>
          Configurações de layout salvas com sucesso!
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', color: 'var(--md-text-secondary)', maxWidth: '800px', textAlign: 'center' }}>Carregando preferências...</div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Identidade Visual</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Cor Primária</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }} 
                    />
                    <input 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', backgroundColor: 'var(--md-surface)', color: 'var(--text-primary)' }} 
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '8px' }}>Logotipo</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ 
                      border: '1px dashed var(--md-border)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '24px', 
                      textAlign: 'center',
                      backgroundColor: 'var(--md-surface)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background-color 0.2s',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    
                    {uploading ? (
                      <span style={{ fontSize: '13px', color: 'var(--md-text-secondary)', fontWeight: 500 }}>Enviando imagem...</span>
                    ) : logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }} />
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--md-text-secondary)', marginBottom: '8px' }}>image</span>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>Clique para upload da Logo</p>
                      </>
                    )}
                  </div>
                  {logoUrl && (
                    <button 
                      onClick={() => setLogoUrl('')}
                      style={{ marginTop: '8px', fontSize: '12px', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Remover logotipo
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={handleSave} 
                disabled={saving || uploading}
                style={{
                  marginTop: '24px', width: '100%', padding: '12px', backgroundColor: 'var(--md-primary)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', 
                  cursor: (saving || uploading) ? 'not-allowed' : 'pointer', opacity: (saving || uploading) ? 0.7 : 1
                }}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', backgroundColor: '#F9FAFB', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            {/* Minimal Mock Checkout Preview */}
            <div style={{ width: '100%', maxWidth: '320px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              <div style={{ backgroundColor: primaryColor, padding: '24px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80px' }}>
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo" style={{ maxHeight: '40px', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: 'sans-serif' }}>Sua Loja</span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ width: '100%', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '6px', marginBottom: '8px' }} />
                <div style={{ width: '70%', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '6px', marginBottom: '24px' }} />
                
                <div style={{ border: `1px solid ${primaryColor}40`, borderRadius: '8px', padding: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: primaryColor }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Cartão de Crédito</span>
                </div>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #D1D5DB' }} />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280' }}>Pix</span>
                </div>

                <div style={{ width: '100%', height: '36px', backgroundColor: primaryColor, borderRadius: '8px', marginTop: '24px', opacity: 0.9 }} />
              </div>
            </div>
            
            <div style={{ marginTop: '24px', textAlign: 'center', opacity: 0.6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--md-text-secondary)', marginBottom: '4px' }}>preview</span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, margin: 0 }}>Live Preview</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
