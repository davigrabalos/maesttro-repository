import React from 'react';

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = 'Nenhum registro encontrado.', onRowClick }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div style={{
        padding: '40px', textAlign: 'center', backgroundColor: 'var(--card-bg)',
        border: '1px dashed var(--md-border)', borderRadius: 'var(--radius-lg)'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--md-text-secondary)', opacity: 0.5 }}>inbox</span>
        <p style={{ color: 'var(--md-text-secondary)', marginTop: '12px' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-lg)',
      overflowX: 'auto',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--md-surface)', borderBottom: '1px solid var(--card-border)' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ 
                padding: '12px 16px', 
                fontSize: '12px', 
                fontWeight: 600, 
                color: 'var(--md-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                width: col.width || 'auto',
                textAlign: col.align || 'left'
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={keyExtractor(item)} 
              onClick={() => onRowClick && onRowClick(item)}
              style={{
                borderBottom: '1px solid var(--card-border)',
                transition: 'background-color 0.2s',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {columns.map((col, idx) => (
                <td key={idx} style={{ 
                  padding: '16px', 
                  fontSize: '14px', 
                  color: 'var(--text-primary)',
                  textAlign: col.align || 'left'
                }}>
                  {col.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
