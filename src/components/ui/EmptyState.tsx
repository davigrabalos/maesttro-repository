import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      backgroundColor: 'var(--card-bg)',
      border: '1px dashed var(--md-border)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      marginTop: '24px'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--md-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--md-primary)' }}>
          {icon}
        </span>
      </div>
      
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title}
      </h3>
      
      <p style={{ fontSize: '14px', color: 'var(--md-text-secondary)', maxWidth: '400px', marginBottom: actionLabel ? '24px' : '0' }}>
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref} style={{
          backgroundColor: 'var(--md-primary)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background-color 0.2s',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
