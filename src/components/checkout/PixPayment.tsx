'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

export function PixPayment() {
  const [showPix, setShowPix] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleTestPix = () => {
    setShowPix(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Pagamento via Pix</h2>
      
      {!showPix ? (
        <div style={{ padding: '16px', border: '1px dashed var(--md-border)', textAlign: 'center' }}>
          <p style={{ marginBottom: '16px', fontSize: '13px' }}>Área reservada para geração de Pix após finalizar compra.</p>
          <Button variant="outlined" onClick={handleTestPix} style={{ fontSize: '12px', height: '32px' }}>
            Gerar Pix Teste (Mock)
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Mock QR Code Box */}
          <div style={{ width: '200px', height: '200px', backgroundColor: '#E2E4DC', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--md-border)' }}>
            [ QR Code Fake ]
          </div>
          
          <Button variant="primary" style={{ marginBottom: '24px' }}>
            Copiar Código Pix
          </Button>

          {/* Simple video explanation placeholder */}
          <div style={{ width: '100%', padding: '16px', border: '1px solid var(--md-border)', marginBottom: '24px', backgroundColor: 'var(--md-surface)' }}>
            <h4 style={{ marginBottom: '8px' }}>Como pagar?</h4>
            <div style={{ width: '100%', height: '150px', backgroundColor: '#1C3A27', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ▶️ Vídeo Explicativo
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <h4 style={{ marginBottom: '8px' }}>Anexar Comprovante</h4>
            <p style={{ fontSize: '12px', color: 'var(--md-text-secondary)', marginBottom: '16px' }}>
              Adquirentes podem atrasar. Envie o comprovante para agilizar.
            </p>
            <input 
              type="file" 
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              style={{ marginBottom: '16px' }}
            />
            {file && (
              <p style={{ fontSize: '13px', color: 'var(--md-success)' }}>
                Arquivo {file.name} anexado com sucesso!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
