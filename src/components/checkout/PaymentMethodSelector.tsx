'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

type PaymentMethod = 'credit_card' | 'pix';

interface PaymentMethodSelectorProps {
  orderId: string | null;
}

export function PaymentMethodSelector({ orderId }: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState<PaymentMethod>('pix');
  const [pixGenerated, setPixGenerated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      if (!orderId) {
        alert('Finalize seus dados primeiro antes de enviar o comprovante!');
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('orderId', orderId);

      try {
        const res = await fetch('/api/checkout/upload-proof', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          setUploadSuccess(true);
        } else {
          alert('Erro ao enviar comprovante: ' + data.error);
          setFile(null);
        }
      } catch (error) {
        console.error(error);
        alert('Erro interno ao enviar comprovante');
        setFile(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const methods: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'pix', label: 'Pix', icon: 'pix' },
    { id: 'credit_card', label: 'Cartão de Crédito', icon: 'credit_card' },
  ];

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>payments</span>
        <h2>Forma de Pagamento</h2>
      </div>

      {/* Method Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        border: '1px solid var(--md-border)',
        marginBottom: '24px',
        overflow: 'hidden',
      }}>
        {methods.map((method, idx) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setSelected(method.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 16px',
              border: 'none',
              borderLeft: idx > 0 ? '1px solid var(--md-border)' : 'none',
              backgroundColor: selected === method.id ? 'var(--md-primary)' : 'var(--md-surface)',
              color: selected === method.id ? '#FFFFFF' : 'var(--md-on-surface)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '13px',
              fontWeight: selected === method.id ? '600' : '400',
              transition: 'background-color 0.2s ease, color 0.2s ease',
            }}
          >
            {method.id === 'pix' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/pix.png"
                alt="Pix Logo"
                className={selected === 'pix' ? '' : 'pix-icon-img'}
                style={{
                  height: '16px',
                  objectFit: 'contain',
                  filter: selected === 'pix' ? 'brightness(0) invert(1)' : undefined,
                  transition: 'filter 0.2s ease',
                }}
              />
            ) : (
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px' }}
              >
                {method.icon}
              </span>
            )}
            <span>{method.label}</span>
          </button>
        ))}
      </div>

      {/* Pix Panel */}
      {selected === 'pix' && (
        <div>
          {!pixGenerated ? (
            <div style={{
              padding: '28px',
              border: '1px dashed var(--md-border)',
              textAlign: 'center',
              backgroundColor: 'var(--md-surface)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--md-primary)', display: 'block', marginBottom: '8px' }}>
                qr_code_2
              </span>
              <p style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--md-text-secondary)' }}>
                Clique para gerar o QR Code e o código Pix copia e cola.
              </p>
              <Button
                variant="primary"
                onClick={() => setPixGenerated(true)}
                style={{ gap: '8px' }}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bolt</span>
                <span>Gerar Código Pix</span>
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* QR Code Box */}
              <div style={{
                width: '200px', height: '200px',
                backgroundColor: '#D2D6C8',
                marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--md-border)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--md-primary)' }}>qr_code_scanner</span>
                  <p style={{ fontSize: '11px', marginTop: '4px' }}>[QR Code]</p>
                </div>
              </div>

              <Button variant="outlined" style={{ marginBottom: '24px', gap: '8px' }} type="button">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>content_copy</span>
                <span>Copiar Código Pix</span>
              </Button>

              {/* Anexar Comprovante */}
              <div style={{ width: '100%', borderTop: '1px solid var(--md-border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--md-primary)' }}>attach_file</span>
                  <h4 style={{ margin: 0 }}>Anexar Comprovante</h4>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--md-text-secondary)', marginBottom: '14px' }}>
                  Envie o comprovante para agilizar a confirmação.
                </p>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  border: '1px solid var(--md-border)',
                  backgroundColor: 'var(--md-surface)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: 'var(--md-text-secondary)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
                  <span>{file ? file.name : 'Selecionar arquivo (imagem ou PDF)'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {uploading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--md-primary)', marginTop: '10px' }}>
                    <span className="material-symbols-outlined">sync</span>
                    <span>Enviando comprovante...</span>
                  </div>
                )}
                {!uploading && uploadSuccess && file && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--md-success)', marginTop: '10px' }}>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>Comprovante salvo! ({file.name})</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Credit Card Panel */}
      {selected === 'credit_card' && (
        <div>
          <Input label="Número do Cartão" type="text" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Validade (MM/AA)" type="text" />
            <Input label="CVV" type="text" />
          </div>
          <Input label="Nome impresso no Cartão" type="text" />
        </div>
      )}
    </div>
  );
}
