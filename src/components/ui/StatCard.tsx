import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number; // percentage
    isPositive: boolean;
    text?: string;
  };
  color?: string;
}

export function StatCard({ title, value, icon, trend, color = 'var(--md-primary)' }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--md-text-secondary)', margin: 0 }}>
          {title}
        </h3>
        {icon && (
          <div style={{ 
            backgroundColor: `${color}15`, 
            color: color,
            padding: '8px', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{icon}</span>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
      </div>
      
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginTop: 'auto', paddingTop: '4px' }}>
          <span style={{ 
            display: 'flex', alignItems: 'center', 
            color: trend.isPositive ? 'var(--green)' : 'var(--red)',
            fontWeight: 600,
            backgroundColor: trend.isPositive ? 'var(--green-light)' : 'var(--red-light)',
            padding: '2px 6px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '2px' }}>
              {trend.isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {trend.value}%
          </span>
          {trend.text && <span style={{ color: 'var(--md-text-secondary)' }}>{trend.text}</span>}
        </div>
      )}
    </div>
  );
}
