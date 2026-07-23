'use client';

import React, { useEffect, useState } from 'react';

const LEVELS = [
  { id: 'iniciante', name: 'Iniciante', threshold: 0, color: '#9CA3AF', icon: 'egg' },
  { id: 'bronze', name: 'Bronze', threshold: 5000, color: '#B45309', icon: 'military_tech' },
  { id: 'prata', name: 'Prata', threshold: 25000, color: '#D1D5DB', icon: 'workspace_premium' },
  { id: 'ouro', name: 'Ouro', threshold: 100000, color: '#F59E0B', icon: 'star' },
  { id: 'diamante', name: 'Diamante', threshold: 500000, color: '#3B82F6', icon: 'diamond' },
];

interface LeaderboardEntry {
  workspace_name: string;
  total_revenue: number;
  rank_position: number;
}

export function RankingTab({ orders }: { orders: any[] }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Aggregate total revenue for the current user's operation to show their progress
  const totalRevenue = orders.reduce((sum, o) => {
    return o.status === 'paid' ? sum + o.amount : sum;
  }, 0);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/admin/leaderboard');
        const data = await res.json();
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

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
        <h2>Ranking Global & Gamificação</h2>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Evolução da sua operação e Top 10 Mundial</span>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Left Side: Personal Progress */}
        <div style={{ flex: '1 1 300px', padding: '32px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: `${currentLevel.color}20`, borderRadius: '50%', marginBottom: '16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: currentLevel.color }}>{currentLevel.icon}</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: currentLevel.color }}>Nível {currentLevel.name}</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Seu faturamento confirmado: <strong style={{ color: 'var(--text-primary)' }}>{formatBRL(totalRevenue)}</strong>
          </p>

          {nextLevel ? (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                <span>Falta {formatBRL(nextLevel.threshold - totalRevenue)} para {nextLevel.name}</span>
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

        {/* Right Side: Global Leaderboard */}
        <div style={{ flex: '2 1 400px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--yellow)' }}>social_leaderboard</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Top 10 Global</h3>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Carregando ranking...</div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Nenhum dado registrado no ranking mundial ainda.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaderboard.map((entry) => (
                <div key={entry.rank_position} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', backgroundColor: entry.rank_position <= 3 ? 'var(--yellow-light)' : 'var(--main-bg)',
                  border: `1px solid ${entry.rank_position <= 3 ? 'var(--yellow)' : 'var(--border)'}`, 
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: entry.rank_position === 1 ? '#F59E0B' : entry.rank_position === 2 ? '#9CA3AF' : entry.rank_position === 3 ? '#B45309' : 'var(--card-bg)',
                      color: entry.rank_position <= 3 ? '#FFF' : 'var(--text-secondary)',
                      fontWeight: 700, fontSize: '14px'
                    }}>
                      #{entry.rank_position}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {entry.workspace_name}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: entry.rank_position <= 3 ? '#F59E0B' : 'var(--text-primary)' }}>
                    {formatBRL(entry.total_revenue)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

