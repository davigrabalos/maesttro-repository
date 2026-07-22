'use client';

import React, { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('app_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to light or check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('app_theme', nextTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: 'var(--md-surface)',
        color: 'var(--md-on-surface)',
        border: '1px solid var(--md-border)',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title={`Alternar para modo ${theme === 'light' ? 'Escuro (Dark)' : 'Claro (Light)'}`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: theme === 'dark' ? '#FDCB6E' : '#0F4C81' }}>
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
      <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
