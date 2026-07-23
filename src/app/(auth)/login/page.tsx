import React from 'react';
import Image from 'next/image';
import { login, signup, signInWithGoogle } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await searchParams;
  const errorMsg = resolvedParams.error;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-body, "Google Sans", sans-serif)' }}>
      
      {/* ===== ESQUERDA: Banner ===== */}
      <div style={{
        flex: 1,
        backgroundColor: '#111827',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(37,99,235,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Logo + Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icon.png" alt="Maesttro icon" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'var(--font-heading, "Barriecito", cursive)',
            fontSize: '72px',
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '0.01em',
          }}>
            Maesttro
          </span>
        </div>

        <p style={{ fontSize: '22px', maxWidth: '420px', opacity: 0.65, lineHeight: 1.65, position: 'relative' }}>
          Tudo conectado. Tudo sob controle.<br />
          Orquestre e automatize toda a sua<br />operação em um só lugar.
        </p>

        {/* Bottom decoration line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.5), transparent)',
        }} />
      </div>

      {/* ===== DIREITA: Formulário ===== */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F6F8',
      }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '0 32px' }}>

          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
            Acesse o Painel
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '28px' }}>
            Entre com seus dados ou crie uma conta.
          </p>

          {errorMsg && (
            <div style={{
              backgroundColor: '#FEE2E2', color: '#DC2626',
              padding: '12px 14px', borderRadius: '8px',
              marginBottom: '20px', fontSize: '13px',
              border: '1px solid #FECACA',
            }}>
              {errorMsg}
            </div>
          )}

          <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', letterSpacing: '0.02em' }}>
                SEU NOME <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(apenas para cadastro)</span>
              </label>
              <input
                name="name"
                placeholder="Ex: Davi"
                style={{
                  padding: '11px 14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  color: '#111827',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', letterSpacing: '0.02em' }}>
                E-MAIL *
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                style={{
                  padding: '11px 14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  color: '#111827',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', letterSpacing: '0.02em' }}>
                SENHA *
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                style={{
                  padding: '11px 14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  color: '#111827',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* Botões lado a lado */}
            <div style={{ display: 'flex', marginTop: '4px' }}>
              {/* Entrar: canto esquerdo arredondado, direito reto */}
              <button
                formAction={login}
                style={{
                  flex: 1,
                  backgroundColor: '#111827',
                  color: '#fff',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '8px 0 0 8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                Entrar
              </button>
              {/* Criar Conta: canto direito arredondado, esquerdo reto */}
              <button
                formAction={signup}
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  color: '#111827',
                  border: '1px solid #D1D5DB',
                  borderLeft: 'none',
                  padding: '13px',
                  borderRadius: '0 8px 8px 0',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Criar Conta
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '22px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em' }}>OU</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
          </div>

          {/* Botão Google */}
          <form>
            <button
              formAction={signInWithGoogle}
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#374151',
                border: '1px solid #D1D5DB',
                padding: '12px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background-color 0.15s, border-color 0.15s',
              }}
            >
              {/* Google "G" SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continuar com o Google
            </button>
          </form>

          <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '28px', lineHeight: 1.6 }}>
            Ao continuar, você concorda com os{' '}
            <span style={{ color: '#374151', textDecoration: 'underline', cursor: 'pointer' }}>Termos de Uso</span>
            {' '}e a{' '}
            <span style={{ color: '#374151', textDecoration: 'underline', cursor: 'pointer' }}>Política de Privacidade</span>
            {' '}do Maesttro.
          </p>

        </div>
      </div>
    </div>
  );
}
