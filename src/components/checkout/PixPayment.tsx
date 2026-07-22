'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

export function PixPayment({ orderId }: { orderId: string | null }) {
  const [showPix, setShowPix] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleTestPix = () => {
    setShowPix(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (!orderId) {
        alert('Crie o pedido primeiro!');
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

  return (
    <div style={{ opacity: orderId ? 1 : 0.5, pointerEvents: orderId ? 'auto' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--md-secondary)' }}>qr_code_2</span>
        <h2>Pagamento via Pix</h2>
      </div>
      
      {!showPix ? (
        <div style={{ padding: '20px', border: '1px dashed var(--md-border)', textAlign: 'center', backgroundColor: 'var(--md-surface)' }}>
          <p style={{ marginBottom: '16px', fontSize: '13px' }}>Área reservada para geração de Pix após finalizar compra.</p>
          <Button variant="outlined" onClick={handleTestPix} style={{ fontSize: '12px', height: '36px', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bolt</span>
            <span>Gerar Pix Teste (Mock)</span>
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Mock QR Code Box */}
          <div style={{ width: '200px', height: '200px', backgroundColor: '#D2D6C8', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--md-border)' }}>
            <div style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--md-primary)' }}>qr_code_scanner</span>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>[ QR Code Fake ]</p>
            </div>
          </div>
          
          <Button variant="primary" style={{ marginBottom: '24px', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>content_copy</span>
            <span>Copiar Código Pix</span>
          </Button>

          {/* Simple video explanation placeholder */}
          <div style={{ width: '100%', padding: '16px', border: '1px solid var(--md-border)', marginBottom: '24px', backgroundColor: 'var(--md-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--md-primary)' }}>play_circle</span>
              <h4 style={{ margin: 0 }}>Como pagar?</h4>
            </div>
            <div style={{ width: '100%', height: '140px', backgroundColor: '#1C3A27', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>play_arrow</span>
              <span>Vídeo Explicativo</span>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--md-primary)' }}>attach_file</span>
              <h4 style={{ margin: 0 }}>Anexar Comprovante</h4>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--md-text-secondary)', marginBottom: '16px' }}>
              Adquirentes podem atrasar. Envie o comprovante para agilizar.
            </p>
            <input 
              type="file" 
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              style={{ marginBottom: '16px' }}
            />
            {uploading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--md-primary)' }}>
                <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
                <span>Enviando comprovante...</span>
              </div>
            )}
            {!uploading && uploadSuccess && file && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--md-success)' }}>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Comprovante salvo com sucesso! ({file.name})</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
