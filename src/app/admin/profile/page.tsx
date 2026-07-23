import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { updateProfile, signOut } from '../actions';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile and workspace data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const { data: workspaceUser } = await supabase
    .from('workspace_users')
    .select('workspaces(name)')
    .eq('user_id', user.id)
    .single();

  const workspaceName = workspaceUser?.workspaces?.name || 'Meu Workspace';

  return (
    <div style={{ backgroundColor: '#F5F6F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header simples para poder voltar */}
      <header style={{ backgroundColor: '#fff', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', color: '#374151', textDecoration: 'none', fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>arrow_back</span>
          Voltar ao Painel
        </Link>
      </header>

      <main style={{ flex: 1, padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Meu Perfil</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>
            Gerencie suas informações pessoais e visualize os detalhes do seu workspace.
          </p>

          <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Foto e Workspace */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E5E7EB',
                backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#9CA3AF'
              }}>
                {!profile?.avatar_url && (profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'AD')}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Workspace Atual
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                  {workspaceName}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>E-mail da Conta</label>
              <input 
                type="email"
                disabled
                value={user.email || ''}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280' }}
              />
              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>O e-mail não pode ser alterado no momento.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Nome Completo *</label>
              <input 
                name="full_name"
                required
                defaultValue={profile?.full_name || ''}
                placeholder="Seu nome"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#111827' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>URL da Foto de Perfil (Opcional)</label>
              <input 
                name="avatar_url"
                defaultValue={profile?.avatar_url || ''}
                placeholder="https://exemplo.com/minhafoto.png"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#111827' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button 
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2563EB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              >
                Salvar Alterações
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '32px 0' }} />

          {/* Sair da Conta */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Sessão</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
              Deseja encerrar sua sessão neste dispositivo?
            </p>
            <form action={signOut}>
              <button 
                type="submit"
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#fff',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                Sair da Conta
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
