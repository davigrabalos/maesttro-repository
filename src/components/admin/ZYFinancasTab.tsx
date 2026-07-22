'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function ZYFinancasTab({ orders }: { orders: any[] }) {
  // Aggregate daily revenue
  const dailyDataMap: Record<string, number> = {};
  orders.forEach(o => {
    if (o.status === 'paid') {
      const date = new Date(o.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      dailyDataMap[date] = (dailyDataMap[date] || 0) + o.amount;
    }
  });
  const revenueData = Object.keys(dailyDataMap).map(k => ({ name: k, total: dailyDataMap[k] }));

  // Aggregate payment methods
  const methodMap = { pix: 0, credit_card: 0 };
  orders.forEach(o => {
    if (o.status === 'paid') {
       if (o.payment_method === 'pix') methodMap.pix++;
       else methodMap.credit_card++;
    }
  });
  const methodData = [
    { name: 'Pix', count: methodMap.pix, fill: '#10b981' }, // emerald
    { name: 'Cartão', count: methodMap.credit_card, fill: '#f59e0b' } // amber
  ];

  return (
    <div className="zy-financas-tab">
      <div className="admin-section-header">
        <h2>Analytics (ZYfinanças)</h2>
        <span style={{ fontSize: '11px', color: 'var(--md-text-secondary)' }}>Visão geral financeira</span>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Receita Confirmada (Por Dia)</h3>
          {revenueData.length === 0 ? (
            <div className="chart-empty">Sem dados suficientes</div>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip formatter={(v: number) => [`R$ ${v.toFixed(2)}`, 'Receita']} />
                  <Line type="monotone" dataKey="total" stroke="var(--md-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--md-primary)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Métodos de Pagamento (Pedidos Pagos)</h3>
          {methodMap.pix === 0 && methodMap.credit_card === 0 ? (
             <div className="chart-empty">Sem dados suficientes</div>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={methodData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
