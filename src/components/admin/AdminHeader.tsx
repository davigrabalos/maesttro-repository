'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
  filterText: string;
  onFilterChange: (text: string) => void;
  isListening: boolean;
  onVoiceSearch: () => void;
  lastRefresh: Date;
  onRefresh: () => void;
  loading: boolean;
  orders: any[];
  profile?: any;
}

export function AdminHeader({
  filterText,
  onFilterChange,
  isListening,
  onVoiceSearch,
  lastRefresh,
  onRefresh,
  loading,
  orders,
  profile,
}: AdminHeaderProps) {

  const [showNotifications, setShowNotifications] = useState(false);
  const [osShortcut, setOsShortcut] = useState('⌘K');
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

  const notifications = [
    { id: 1, title: 'Atualização do Painel v1.0', desc: 'Nova navbar vermelha e filtro de loja adicionados.', time: 'Hoje' },
    { id: 2, title: 'Integração de Pagamentos', desc: 'Aprovação automática de Pix operando em 100%.', time: 'Ontem' },
    { id: 3, title: 'Notícia de Sistema', desc: 'Relatórios de ZYfinanças sincronizados.', time: 'Há 2 dias' },
  ];

  // Calculate Gamified Level
  const LEVELS = [
    { id: 'iniciante', name: 'Iniciante', threshold: 0, color: '#9CA3AF' },
    { id: 'bronze', name: 'Bronze', threshold: 5000, color: '#B45309' },
    { id: 'prata', name: 'Prata', threshold: 25000, color: '#D1D5DB' },
    { id: 'ouro', name: 'Ouro', threshold: 100000, color: '#F59E0B' },
    { id: 'diamante', name: 'Diamante', threshold: 500000, color: '#3B82F6' },
  ];

  const totalRevenue = orders.reduce((sum, o) => {
    return o.status === 'paid' ? sum + o.amount : sum;
  }, 0);

  let currentLevelIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalRevenue >= LEVELS[i].threshold) {
      currentLevelIndex = i;
    } else {
      break;
    }
  }

  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = currentLevelIndex < LEVELS.length - 1 ? LEVELS[currentLevelIndex + 1] : null;

  const progressPercentage = nextLevel 
    ? Math.min(100, Math.max(0, ((totalRevenue - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100))
    : 100;

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
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Pesquisar pedidos, pix, e-mail..."
          className="topbar-search-input"
        />
        <button
          onClick={onVoiceSearch}
          className={`topbar-voice-btn ${isListening ? 'listening' : ''}`}
          title="Pesquisa por voz"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mic</span>
        </button>
        <kbd className="topbar-shortcut-badge">{osShortcut}</kbd>
      </div>

      {/* Right Controls: Ranking, Notifications, Help, Profile */}
      <div className="topbar-actions">
        {/* Ranking Progress */}
        <div className="topbar-ranking-progress" title={`Nível ${currentLevel.name}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: currentLevel.color }}>emoji_events</span>
          <div style={{ width: '90px', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: currentLevel.color, borderRadius: '4px' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Nv. {currentLevelIndex + 1}</span>
        </div>

        {/* Refresh button */}
        <button
          className="topbar-icon-btn"
          onClick={onRefresh}
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
            <span className="topbar-badge-dot" />
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

        {/* User Profile Avatar */}
        <Link href="/admin/profile" className="topbar-profile-avatar" title={profile?.profile?.full_name || "Meu Perfil"} style={{
          ...(profile?.profile?.avatar_url ? {
            backgroundImage: `url(${profile.profile.avatar_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'transparent'
          } : {}),
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 0.2s, transform 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.2)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {!profile?.profile?.avatar_url ? (
            <span>{profile?.profile?.full_name ? profile.profile.full_name.substring(0, 2).toUpperCase() : 'AD'}</span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
