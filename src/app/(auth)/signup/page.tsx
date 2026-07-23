import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signup, signInWithGoogle } from '../login/actions';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await searchParams;
  const errorMsg = resolvedParams.error;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-body, "Google Sans", sans-serif)' }}>
      
      {/* CSS para o Gradiente Animado de Fundo */}
      <style>{`
        @keyframes brandBgGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .login-left-banner {
          flex: 1;
          background: linear-gradient(-45deg, #0f172a, #1e3a8a, #172554, #1e40af, #0f172a);
          background-size: 400% 400%;
          animation: brandBgGradient 14s ease infinite;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px;
          color: #ffffff;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
      `}</style>

      {/* ===== ESQUERDA: Banner com Gradiente Animado da Marca ===== */}
      <div className="login-left-banner">
        {/* Overlay escuro sutil para garantir alto contraste do texto */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, rgba(17, 24, 39, 0.4) 0%, rgba(17, 24, 39, 0.75) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Logo + Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icon.png" alt="Maesttro icon" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'var(--font-heading, "Barriecito", cursive)',
            fontSize: '72px',
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '0.01em',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            Maesttro
          </span>
        </div>

        <p style={{ fontSize: '22px', maxWidth: '420px', opacity: 0.9, lineHeight: 1.65, position: 'relative', zIndex: 1, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
          Crie sua conta no Maesttro.<br />
          Tudo conectado. Tudo sob controle.
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
            Criar Nova Conta
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '28px' }}>
            Preencha seus dados para começar.
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
                SEU NOME
              </label>
              <input
                name="name"
                required
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

            {/* Botão de Registro */}
            <div style={{ display: 'flex', marginTop: '4px' }}>
              <button
                formAction={signup}
                style={{
                  flex: 1,
                  backgroundColor: '#111827',
                  color: '#fff',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
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
              Cadastrar com o Google
            </button>
          </form>

          <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginTop: '24px' }}>
            Já tem uma conta?{' '}
            <Link href="/login" style={{ color: '#111827', fontWeight: 600, textDecoration: 'none' }}>
              Entrar aqui
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
