import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { updateProfile, signOut } from '../actions';
import { redirect } from 'next/navigation';
import { AvatarSelector } from '@/components/admin/AvatarSelector';

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
    .select('workspace_id, workspaces(name)')
    .eq('user_id', user.id)
    .single();

  const rawWs = workspaceUser?.workspaces as any;
  const workspaceName = (Array.isArray(rawWs) ? rawWs[0]?.name : rawWs?.name) || 'Meu Workspace';
  const workspaceId = workspaceUser?.workspace_id;

  // Gamification Metrics
  const [{ count: storesCount }, { count: ordersCount }] = await Promise.all([
    supabase.from('stores').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
  ]);

  const { data: maxOrder } = await supabase.from('orders').select('amount').eq('workspace_id', workspaceId).order('amount', { ascending: false }).limit(1);
  const { data: minOrder } = await supabase.from('orders').select('amount').eq('workspace_id', workspaceId).order('amount', { ascending: true }).limit(1);
  const { count: pixPaidCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('payment_method', 'pix').eq('status', 'paid');

  const achievements = [
    { id: 'start', title: 'O Começo de Tudo', desc: 'Cadastrou a primeira loja.', unlocked: (storesCount || 0) >= 1, icon: 'storefront' },
    { id: 'magnata', title: 'Magnata do Varejo', desc: 'Expandiu os negócios e cadastrou 5 lojas.', unlocked: (storesCount || 0) >= 5, icon: 'domain' },
    { id: 'lobo', title: 'Lobo de Wall Street', desc: 'Atingiu a marca de 10 pedidos na plataforma.', unlocked: (ordersCount || 0) >= 10, icon: 'trending_up' },
    { id: 'baleia', title: 'Pescaria Grossa', desc: 'Realizou uma venda de alto valor (Acima de R$ 1.000).', unlocked: !!(maxOrder && maxOrder.length > 0 && maxOrder[0].amount >= 1000), icon: 'phishing' },
    { id: 'centavo', title: 'De Grão em Grão', desc: 'Realizou uma micro-venda (Abaixo de R$ 10).', unlocked: !!(minOrder && minOrder.length > 0 && minOrder[0].amount < 10), icon: 'payments' },
    { id: 'rei_pix', title: 'Rei do Pix', desc: 'Recebeu 10 pagamentos aprovados no Pix.', unlocked: (pixPaidCount || 0) >= 10, icon: 'bolt' },
    { id: 'avatar', title: 'Perfeccionista', desc: 'Configurou um avatar estiloso.', unlocked: !!profile?.avatar_url, icon: 'face' },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Dynamic Avatar Border
  let borderStyle = '2px solid #fff'; // Iniciante
  let shadowStyle = '0 4px 6px rgba(0,0,0,0.05)';
  if (unlockedCount >= 6) { // Mestre
    borderStyle = '3px solid #FBBF24';
    shadowStyle = '0 0 15px rgba(251,191,36,0.6)';
  } else if (unlockedCount >= 4) { // Prata
    borderStyle = '3px solid #94A3B8';
    shadowStyle = '0 0 15px rgba(148,163,184,0.6)';
  } else if (unlockedCount >= 2) { // Bronze
    borderStyle = '3px solid #B45309';
    shadowStyle = '0 0 15px rgba(180,83,9,0.5)';
  }

  return (
    <div style={{ backgroundColor: '#F5F6F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header com Gradiente Animado (estilo Maesttro) */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #172554 100%)',
        padding: '32px 24px 120px 24px', // Espaço extra embaixo para o card sobrepor
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <Link href="/admin" className="link-profile-back" style={{ display: 'inline-flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '14px', transition: 'color 0.2s', marginBottom: '24px' }}>
            <span className="material-symbols-outlined" style={{ marginRight: '6px', fontSize: '18px' }}>arrow_back</span>
            Voltar ao Painel
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Meu Perfil</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginTop: '8px' }}>
            Gerencie suas informações pessoais e visualize os detalhes do seu workspace.
          </p>
        </div>
      </div>

      <main style={{ flex: 1, padding: '0 24px 60px 24px', display: 'flex', justifyContent: 'center', marginTop: '-80px' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '800px', 
          backgroundColor: '#fff', 
          padding: '40px', 
          borderRadius: '16px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>

          <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Foto e Workspace com Borda Dinâmica */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', padding: '24px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #E5E7EB' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E5E7EB',
                backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#9CA3AF',
                boxShadow: shadowStyle,
                border: borderStyle,
                transition: 'all 0.3s ease-in-out'
              }}>
                {!profile?.avatar_url && (profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'AD')}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Workspace Logado
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                  {workspaceName}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#FBBF24' }}>star</span>
                  {unlockedCount} / {achievements.length} Conquistas
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

            <AvatarSelector initialAvatarUrl={profile?.avatar_url || null} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button 
                type="submit"
                className="btn-profile-primary"
                style={{
                  padding: '14px 28px',
                  backgroundColor: '#111827',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, transform 0.1s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '32px 0' }} />

          {/* GAMIFICAÇÃO: Conquistas */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#FBBF24' }}>emoji_events</span>
              Mural de Conquistas
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
              Complete metas na plataforma para desbloquear novas bordas para o seu perfil.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              {achievements.map((ach) => (
                <div key={ach.id} style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: `1px solid ${ach.unlocked ? '#D1FAE5' : '#E5E7EB'}`,
                  backgroundColor: ach.unlocked ? '#F0FDF4' : '#F9FAFB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  opacity: ach.unlocked ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="material-symbols-outlined" style={{ 
                      fontSize: '28px', 
                      color: ach.unlocked ? '#059669' : '#9CA3AF' 
                    }}>
                      {ach.icon}
                    </span>
                    {ach.unlocked && (
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10B981' }}>check_circle</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: ach.unlocked ? '#065F46' : '#374151' }}>
                      {ach.title}
                    </div>
                    <div style={{ fontSize: '12px', color: ach.unlocked ? '#047857' : '#6B7280', marginTop: '4px', lineHeight: 1.4 }}>
                      {ach.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                className="btn-profile-logout"
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
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                Encerrar Sessão
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
