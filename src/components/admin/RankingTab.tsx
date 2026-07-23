'use client';

import React from 'react';

const LEVELS = [
  { id: 'iniciante', name: 'Iniciante', threshold: 0, color: '#9CA3AF', icon: 'egg' },
  { id: 'bronze', name: 'Bronze', threshold: 5000, color: '#B45309', icon: 'military_tech' },
  { id: 'prata', name: 'Prata', threshold: 25000, color: '#D1D5DB', icon: 'workspace_premium' },
  { id: 'ouro', name: 'Ouro', threshold: 100000, color: '#F59E0B', icon: 'star' },
  { id: 'diamante', name: 'Diamante', threshold: 500000, color: '#3B82F6', icon: 'diamond' },
];

export function RankingTab({ orders }: { orders: any[] }) {
  // Aggregate total revenue for the entire operation
  const totalRevenue = orders.reduce((sum, o) => {
    return o.status === 'paid' ? sum + o.amount : sum;
  }, 0);

  // Determine current level
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

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="ranking-tab">
      <div className="admin-section-header">
        <h2>Progresso & Gamificação</h2>
        <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>Evolução da sua operação baseada em faturamento validado</span>
      </div>

      <div style={{ padding: '32px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: `${currentLevel.color}20`, borderRadius: '50%', marginBottom: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: currentLevel.color }}>{currentLevel.icon}</span>
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: currentLevel.color }}>Nível {currentLevel.name}</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Você já faturou <strong style={{ color: 'var(--text-primary)' }}>{formatBRL(totalRevenue)}</strong> no total.
        </p>

        {nextLevel ? (
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <span>Falta {formatBRL(nextLevel.threshold - totalRevenue)} para o nível {nextLevel.name}</span>
              <span style={{ fontWeight: 600 }}>{Math.round(progressPercentage)}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--main-bg)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercentage}%`, backgroundColor: currentLevel.color, borderRadius: '4px', transition: 'width 1s ease-in-out' }} />
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '400px', margin: '0 auto', padding: '16px', backgroundColor: `${currentLevel.color}10`, color: currentLevel.color, borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
            🎉 Parabéns! Você alcançou o nível máximo do Maesttro.
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>Próximos Marcos</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {LEVELS.map((level, index) => {
          const isUnlocked = index <= currentLevelIndex;
          const isCurrent = index === currentLevelIndex;
          return (
            <div key={level.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px', backgroundColor: isCurrent ? 'var(--card-bg)' : (isUnlocked ? 'var(--main-bg)' : 'var(--card-bg)'),
              border: `1px solid ${isCurrent ? currentLevel.color : 'var(--card-border)'}`, borderRadius: 'var(--radius-md)',
              opacity: isUnlocked ? 1 : 0.5
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: isUnlocked ? `${level.color}20` : 'var(--main-bg)',
                color: isUnlocked ? level.color : 'var(--text-secondary)'
              }}>
                <span className="material-symbols-outlined">{isUnlocked ? level.icon : 'lock'}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Nível {level.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Faturamento acima de {formatBRL(level.threshold)}</div>
              </div>
              {isUnlocked && (
                <span className="material-symbols-outlined" style={{ color: 'var(--green)', fontSize: '20px' }}>check_circle</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

