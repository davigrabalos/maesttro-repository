'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SessionCheckoutClientWrapper({ session, settings }: { session: any, settings: any }) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');

  const acceptsPix = settings?.accepts_pix !== false;
  const acceptsCard = settings?.accepts_credit_card !== false;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          payment_method: paymentMethod
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao processar');

      router.push(`/checkout/status/${data.order_id}`);
    } catch (error: any) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Indicador de Passos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 1 ? 1 : 0.5 }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--checkout-primary)' : 'var(--md-border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>1</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Identificação</span>
        </div>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--md-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 2 ? 1 : 0.5 }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--checkout-primary)' : 'var(--md-border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Pagamento</span>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', backgroundColor: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
          {errorMsg}
        </div>
      )}

      {step === 1 && (
          <form 
            key="step1"
            onSubmit={handleNextStep}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '4px' }}>Nome Completo</label>
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="João da Silva" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--md-border)', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '4px' }}>E-mail</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@email.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--md-border)', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--md-text-secondary)', marginBottom: '4px' }}>Celular (WhatsApp)</label>
              <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--md-border)', fontSize: '14px', outline: 'none' }} />
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--checkout-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}>
              Continuar para Pagamento
            </button>
          </form>
        )}

        {step === 2 && (
          <form 
            key="step2"
            onSubmit={handleFinish}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Forma de Pagamento</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                
                {acceptsPix && (
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: paymentMethod === 'pix' ? '2px solid var(--checkout-primary)' : '1px solid var(--md-border)', backgroundColor: paymentMethod === 'pix' ? 'var(--checkout-primary)' : 'transparent', color: paymentMethod === 'pix' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                  >
                    <span className="material-symbols-outlined">pix</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Pix (Rápido)</span>
                  </button>
                )}

                {acceptsCard && (
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: paymentMethod === 'credit_card' ? '2px solid var(--checkout-primary)' : '1px solid var(--md-border)', backgroundColor: paymentMethod === 'credit_card' ? 'var(--checkout-primary)' : 'transparent', color: paymentMethod === 'credit_card' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                  >
                    <span className="material-symbols-outlined">credit_card</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Cartão</span>
                  </button>
                )}

              </div>
            </div>

            {paymentMethod === 'credit_card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', border: '1px solid var(--md-border)', borderRadius: '8px', backgroundColor: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/visa-brand-symbol-1000x668.png" alt="Visa" style={{ height: '24px', objectFit: 'contain' }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/ma_symbol_opt_45_3x.png" alt="Mastercard" style={{ height: '24px', objectFit: 'contain' }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/AXP_BlueBoxLogo_Alternate_REGULARscale_RGB_DIGITAL_700x700.png" alt="Amex" style={{ height: '24px', objectFit: 'contain' }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/ELO_Marca_principal_CMYK-02.png" alt="Elo" style={{ height: '24px', objectFit: 'contain' }} />
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--md-border)', width: '100%' }} />
                <span style={{ fontSize: '13px', color: 'var(--md-text-secondary)', textAlign: 'center' }}>
                  Simulação! Os dados reais do cartão seriam preenchidos aqui.
                </span>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {loading ? (
                <>Processando...</>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                  Pagar R$ {session.total_amount.toFixed(2).replace('.', ',')}
                </>
              )}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--md-text-secondary)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
              Voltar
            </button>
          </form>
        )}
    </div>
  );
}
