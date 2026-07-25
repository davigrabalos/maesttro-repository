'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useHomeData } from './HomeContext';

export function AppHeader() {
  const { globalSearchText, setGlobalSearchText, lastRefresh, fetchData, loading, profile } = useHomeData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [osShortcut, setOsShortcut] = useState('⌘K');
  const [isListening, setIsListening] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect OS for shortcut display
    if (typeof window !== 'undefined') {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      setOsShortcut(isMac ? '⌘K' : 'Ctrl+K');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta pesquisa por voz. Tente usar o Chrome.');
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setGlobalSearchText(event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const notifications = [
    { id: 1, title: 'Nova Arquitetura', desc: 'Rotas divididas e organizadas em subseções.', time: 'Hoje' },
  ];

  // Dynamic Border based on DB achievement_level
  const level = profile?.profile?.achievement_level || 0;
  let borderStyle = '2px solid transparent';
  let shadowStyle = 'none';
  let levelColor = '#9CA3AF';
  let levelName = 'Iniciante';

  if (level >= 6) {
    borderStyle = '3px solid #FBBF24'; // Ouro/Diamante
    shadowStyle = '0 0 15px rgba(251,191,36,0.6)';
    levelColor = '#FBBF24';
    levelName = 'Mestre';
  } else if (level >= 4) {
    borderStyle = '3px solid #94A3B8'; // Prata
    shadowStyle = '0 0 15px rgba(148,163,184,0.6)';
    levelColor = '#94A3B8';
    levelName = 'Prata';
  } else if (level >= 2) {
    borderStyle = '3px solid #B45309'; // Bronze
    shadowStyle = '0 0 15px rgba(180,83,9,0.5)';
    levelColor = '#B45309';
    levelName = 'Bronze';
  }

  return (
    <header className="admin-red-topbar">
      {/* Brand Logo & Name */}
      <div className="topbar-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icon.png" alt="Maesttro" className="topbar-logo-img" />
        <span className="topbar-brand-title">Maesttro Checkout</span>
      </div>

      {/* Center Search Bar with Cmd+K */}
      <div className="topbar-search-container">
        <span className="material-symbols-outlined topbar-search-icon">search</span>
        <input
          ref={searchInputRef}
          type="text"
          value={globalSearchText}
          onChange={(e) => setGlobalSearchText(e.target.value)}
          placeholder="Pesquisar pedidos, pix, e-mail..."
          className="topbar-search-input"
        />
        <button
          onClick={startVoiceSearch}
          className={`topbar-voice-btn ${isListening ? 'listening' : ''}`}
          title="Pesquisa por voz"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mic</span>
        </button>
        <kbd className="topbar-shortcut-badge">{osShortcut}</kbd>
      </div>

      {/* Right Controls: Ranking, Notifications, Help, Profile */}
      <div className="topbar-actions">
        {/* Nível da Conta */}
        <div className="topbar-ranking-progress" title={`Nível ${levelName}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: levelColor }}>emoji_events</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: levelColor }}>{levelName}</span>
        </div>

        {/* Refresh button */}
        <button
          className="topbar-icon-btn"
          onClick={fetchData}
          disabled={loading}
          title="Atualizar dados"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '22px', animation: loading ? 'spin 1s linear infinite' : 'none' }}
          >
            {loading ? 'sync' : 'refresh'}
          </span>
        </button>

        {/* Notifications Icon */}
        <div className="topbar-popover-wrapper">
          <button
            className="topbar-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notificações & Notícias"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
            {notifications.length > 0 && <span className="topbar-badge-dot" />}
          </button>

          {showNotifications && (
            <div className="topbar-notifications-dropdown">
              <div className="notifications-header">
                <span>Notícias & Atualizações</span>
                <button onClick={() => setShowNotifications(false)} className="close-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                </button>
              </div>
              <div className="notifications-list">
                {notifications.map((item) => (
                  <div key={item.id} className="notification-item">
                    <div className="item-title">{item.title}</div>
                    <div className="item-desc">{item.desc}</div>
                    <div className="item-time">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Icon (Q&A) */}
        <Link href="/qa" className="topbar-icon-btn" title="Central de Ajuda (Q&A)">
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>help</span>
        </Link>

        {/* User Profile Avatar with dynamic border */}
        <Link href="/home/profile" className="topbar-profile-avatar" title={profile?.profile?.full_name || "Meu Perfil"} style={{
          ...(profile?.profile?.avatar_url ? {
            backgroundImage: `url(${profile.profile.avatar_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'transparent'
          } : {}),
          border: borderStyle,
          boxShadow: shadowStyle,
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          transition: 'all 0.3s ease'
        }}>
          {!profile?.profile?.avatar_url ? (
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{profile?.profile?.full_name ? profile.profile.full_name.substring(0, 2).toUpperCase() : 'AD'}</span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
