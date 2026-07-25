'use client';

import React, { useState } from 'react';

const AVATARS = [
  'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f87171',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=fb923c',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Oliver&backgroundColor=fbbf24',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Luna&backgroundColor=34d399',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=38bdf8',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Mia&backgroundColor=818cf8',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Jack&backgroundColor=c084fc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Chloe&backgroundColor=f472b6',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=94a3b8',
];

interface AvatarSelectorProps {
  initialAvatarUrl: string | null;
}

export function AvatarSelector({ initialAvatarUrl }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(initialAvatarUrl);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Escolha seu Avatar</label>
      
      {/* Hidden input to pass the value in FormData to the Server Action */}
      <input type="hidden" name="avatar_url" value={selectedAvatar || ''} />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', 
        gap: '12px',
        backgroundColor: '#F9FAFB',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB'
      }}>
        
        {/* Opção: Sem Avatar (Inicial) */}
        <button
          type="button"
          onClick={() => setSelectedAvatar(null)}
          title="Usar inicial do nome"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#E5E7EB',
            border: selectedAvatar === null ? '3px solid #111827' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: selectedAvatar === null ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#9CA3AF' }}>font_download</span>
        </button>

        {AVATARS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => setSelectedAvatar(url)}
            title="Selecionar Avatar"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover',
              border: selectedAvatar === url ? '3px solid #111827' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedAvatar === url ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
