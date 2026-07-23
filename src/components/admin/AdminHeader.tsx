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
}

export function AdminHeader({
  filterText,
  onFilterChange,
  isListening,
  onVoiceSearch,
  lastRefresh,
  onRefresh,
  loading,
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
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mic</span>
        </button>
        <kbd className="topbar-shortcut-badge">{osShortcut}</kbd>
      </div>

      {/* Right Controls: Notifications, Help, Profile */}
      <div className="topbar-actions">
        {/* Refresh button */}
        <button
          className="topbar-icon-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Atualizar dados"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px', animation: loading ? 'spin 1s linear infinite' : 'none' }}
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
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
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
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>help</span>
        </Link>

        {/* User Profile Avatar */}
        <div className="topbar-profile-avatar" title="Minha Conta (Administrador)">
          <span>AD</span>
        </div>
      </div>
    </header>
  );
}
