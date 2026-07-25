import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{title}</h1>
        <p style={{ fontSize: '14px', color: 'var(--md-text-secondary)', margin: 0 }}>{description}</p>
      </div>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
